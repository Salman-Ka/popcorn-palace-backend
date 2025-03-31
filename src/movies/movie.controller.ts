import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getAll(): Promise<Movie[]> {
    return this.movieService.getAll();
  }

  // @Post()
  // create(@Body() movie: Partial<Movie>): Promise<Movie> {
  //   return this.movieService.create(movie);
  // }

  @Post()
create(@Body() dto: CreateMovieDto): Promise<Movie> {
  return this.movieService.create(dto);
}


  @Put(':id')
update(@Param('id') id: string, @Body() updatedMovie: Partial<Movie>): Promise<Movie> {
  return this.movieService.update(Number(id), updatedMovie);
}

@Delete(':id')
delete(@Param('id') id: string): Promise<void> {
  return this.movieService.delete(Number(id));
}

}
