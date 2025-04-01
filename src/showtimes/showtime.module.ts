import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './showtime.entity';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { Movie } from '../movies/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie])],
  providers: [ShowtimeService],
  controllers: [ShowtimeController],
})
export class ShowtimeModule {}
