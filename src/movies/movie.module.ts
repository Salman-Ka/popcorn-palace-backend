import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  // Import TypeORM support for the Movie entity
  imports: [TypeOrmModule.forFeature([Movie])],

  // Register the MovieService to handle business logic
  providers: [MovieService],

  // Register the MovieController to handle incoming HTTP requests
  controllers: [MovieController],
})
export class MovieModule {}
