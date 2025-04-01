import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { Showtime } from './showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  // Create a new showtime with validation and movie existence check
  @Post()
  create(@Body() dto: CreateShowtimeDto): Promise<Showtime> {
    return this.showtimeService.create(dto);
  }

  // Get a list of all showtimes, including movie info
  @Get()
  getAll(): Promise<Showtime[]> {
    return this.showtimeService.getAll();
  }

  // Get a single showtime by ID (with movie included)
  @Get(':id')
  getById(@Param('id') id: string): Promise<Showtime> {
    return this.showtimeService.getById(Number(id));
  }

  // Update a showtime by ID (also validates overlap and movie existence)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedShowtime: Partial<Showtime>
  ): Promise<Showtime> {
    return this.showtimeService.update(Number(id), updatedShowtime);
  }

  // Delete a showtime by ID
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.showtimeService.delete(Number(id));
  }
}
