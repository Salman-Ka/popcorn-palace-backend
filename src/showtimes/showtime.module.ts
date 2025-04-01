import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { Movie } from '../movies/movie.entity';

@Module({
  // Register the Showtime and Movie entities with TypeORM so they can be injected into services
  imports: [TypeOrmModule.forFeature([Showtime, Movie])],

  // Provide the ShowtimeService to handle business logic
  providers: [ShowtimeService],

  // Declare the controller to handle incoming HTTP requests
  controllers: [ShowtimeController],
})
export class ShowtimeModule {}
