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

    // Inject the movie repository to validate movie existence
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  // Check if there is an overlapping showtime in the same theater
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

  // Create a new showtime with overlap and movie existence validation
  async create(showtime: CreateShowtimeDto): Promise<Showtime> {
    // Check if the movie exists
    const movie = await this.movieRepo.findOneBy({ id: showtime.movie as number });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${showtime.movie} not found`);
    }

    // Convert start and end times to Date objects
    const start = typeof showtime.start_time === 'string'
      ? new Date(showtime.start_time)
      : showtime.start_time;

    const end = typeof showtime.end_time === 'string'
      ? new Date(showtime.end_time)
      : showtime.end_time;

    // Check for overlapping showtimes
    if (await this.hasOverlap(showtime.theater, start, end)) {
      throw new ConflictException('Showtime overlaps with an existing showtime in this theater.');
    }

    // Create and save the new showtime
    const newShowtime = this.showtimeRepo.create({
      ...showtime,
      movie,
    });

    return this.showtimeRepo.save(newShowtime);
  }

  // Return all showtimes with movie details
  async getAll(): Promise<Showtime[]> {
    return this.showtimeRepo.find({
      relations: ['movie'],
    });
  }

  // Return a showtime by ID with movie details
  async getById(id: number): Promise<Showtime> {
    return this.showtimeRepo.findOne({
      where: { id },
      relations: ['movie'],
    });
  }

  // Update a showtime with movie existence check and overlap prevention
  async update(id: number, updatedData: Partial<Showtime>): Promise<Showtime> {
    const existing = await this.showtimeRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

// If movie ID is being updated, validate the new movie exists
if (updatedData.movie) {
  // Support both number (ID) or object ({ id: number })
  const movieId =
    typeof updatedData.movie === 'number'
      ? updatedData.movie
      : (updatedData.movie as Movie).id;

  if (!movieId) {
    throw new NotFoundException('Invalid movie ID provided');
  }

  const movieExists = await this.movieRepo.findOneBy({ id: movieId });
  if (!movieExists) {
    throw new NotFoundException(`Movie with ID ${movieId} not found`);
  }

  // Set updatedData.movie to an instance of Movie with the correct ID
  const movie = new Movie();
  movie.id = movieId;
  updatedData.movie = movie;
}

    // Convert times and preserve existing values if not provided
    const start = typeof updatedData.start_time === 'string'
      ? new Date(updatedData.start_time)
      : updatedData.start_time ?? existing.start_time;

    const end = typeof updatedData.end_time === 'string'
      ? new Date(updatedData.end_time)
      : updatedData.end_time ?? existing.end_time;

    const theater = updatedData.theater ?? existing.theater;

    // Prevent overlapping showtime updates
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

  // Delete a showtime by ID
  async delete(id: number): Promise<void> {
    const existing = await this.showtimeRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Showtime with id ${id} not found`);
    }

    await this.showtimeRepo.delete(id);
  }
}
