import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';

@Injectable()
export class MovieService {
  constructor(
    // Inject the Movie repository using TypeORM
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  // Retrieve all movies from the database
  async getAll(): Promise<Movie[]> {
    return this.movieRepo.find();
  }

  // Create a new movie record in the database
  async create(movie: Partial<Movie>): Promise<Movie> {
    const newMovie = this.movieRepo.create(movie); // Instantiate new Movie entity
    return this.movieRepo.save(newMovie); // Save to DB
  }

  // Update an existing movie, with a check to ensure it exists
  async update(id: number, updatedData: Partial<Movie>): Promise<Movie> {
    const existing = await this.movieRepo.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    await this.movieRepo.update(id, updatedData); // Apply updates
    return this.movieRepo.findOneBy({ id }); // Return updated entity
  }

  // Delete a movie, with a check to ensure it exists
  async delete(id: number): Promise<void> {
    const existing = await this.movieRepo.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }

    await this.movieRepo.delete(id); // Delete record
  }
}
