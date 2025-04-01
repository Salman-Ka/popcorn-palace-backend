// Controller for handling movie-related HTTP requests

import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies') // All routes here are prefixed with /movies
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get() // GET /movies - Retrieve all movies
  getAll(): Promise<Movie[]> {
    return this.movieService.getAll();
  }

  // POST /movies - Create a new movie using validated DTO input
  @Post()
  create(@Body() dto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(dto);
  }

  // PUT /movies/:id - Update a movie by ID
  @Put(':id')
  update(@Param('id') id: string, @Body() updatedMovie: Partial<Movie>): Promise<Movie> {
    return this.movieService.update(Number(id), updatedMovie);
  }

  // DELETE /movies/:id - Delete a movie by ID
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.movieService.delete(Number(id));
  }
}
