import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Showtime } from './showtime.entity';
import { Movie } from '../movies/movie.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}

  private async hasOverlap(
    theater: string,
    start: Date,
    end: Date,
    excludeId?: number
  ): Promise<boolean> {
    const where: any = {
      theater,
      start_time: LessThan(end),
      end_time: MoreThan(start),
    };

    if (excludeId !== undefined) {
      where.id = Not(excludeId);
    }

    const overlap = await this.showtimeRepo.findOne({ where });
    return !!overlap;
  }

  async create(showtime: CreateShowtimeDto): Promise<Showtime> {
    const movie = new Movie();
    movie.id = showtime.movie as unknown as number;

    const start = typeof showtime.start_time === 'string'
      ? new Date(showtime.start_time)
      : showtime.start_time;

    const end = typeof showtime.end_time === 'string'
      ? new Date(showtime.end_time)
      : showtime.end_time;

    if (await this.hasOverlap(showtime.theater, start, end)) {
      throw new ConflictException('Showtime overlaps with an existing showtime in this theater.');
    }

    const newShowtime = this.showtimeRepo.create({
      ...showtime,
      movie,
    });

    return this.showtimeRepo.save(newShowtime);
  }

  async getAll(): Promise<Showtime[]> {
    return this.showtimeRepo.find({
      relations: ['movie'],
    });
  }

  async getById(id: number): Promise<Showtime> {
    return this.showtimeRepo.findOne({
      where: { id },
      relations: ['movie'],
    });
  }

  async update(id: number, updatedData: Partial<Showtime>): Promise<Showtime> {
    const existing = await this.showtimeRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

    if (updatedData.movie) {
      const movie = new Movie();
      movie.id = updatedData.movie as unknown as number;
      updatedData.movie = movie;
    }

    const start = typeof updatedData.start_time === 'string'
      ? new Date(updatedData.start_time)
      : updatedData.start_time ?? existing.start_time;

    const end = typeof updatedData.end_time === 'string'
      ? new Date(updatedData.end_time)
      : updatedData.end_time ?? existing.end_time;

    const theater = updatedData.theater ?? existing.theater;

    if (await this.hasOverlap(theater, start, end, id)) {
      throw new ConflictException('Updated showtime would overlap with an existing showtime in this theater.');
    }

    await this.showtimeRepo.update(id, {
      ...updatedData,
      start_time: start,
      end_time: end,
      theater,
    });

    return this.showtimeRepo.findOne({
      where: { id },
      relations: ['movie'],
    });
  }

  async delete(id: number): Promise<void> {
    const existing = await this.showtimeRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

    await this.showtimeRepo.delete(id);
  }
}
