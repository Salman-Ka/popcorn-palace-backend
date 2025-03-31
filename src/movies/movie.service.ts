import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  async getAll(): Promise<Movie[]> {
    return this.movieRepo.find();
  }

  async create(movie: Partial<Movie>): Promise<Movie> {
    const newMovie = this.movieRepo.create(movie);
    return this.movieRepo.save(newMovie);
  }

  // async update(id: number, updatedMovie: Partial<Movie>): Promise<Movie> {
  //   await this.movieRepo.update(id, updatedMovie);
  //   return this.movieRepo.findOneBy({ id });
  // }

  async update(id: number, updatedData: Partial<Movie>): Promise<Movie> {
    const existing = await this.movieRepo.findOneBy({ id });
    if (!existing) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
  
    await this.movieRepo.update(id, updatedData);
    return this.movieRepo.findOneBy({ id });
  }
  


  async delete(id: number): Promise<void> {
    await this.movieRepo.delete(id);
  }
  
  
}
