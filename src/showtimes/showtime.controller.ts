import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { Showtime } from './showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';


@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  // @Post()
  // create(@Body() showtime: Partial<Showtime>): Promise<Showtime> {
  //   return this.showtimeService.create(showtime);
  // }

  @Post()
create(@Body() dto: CreateShowtimeDto): Promise<Showtime> {
  return this.showtimeService.create(dto);
}

  @Get()
  getAll(): Promise<Showtime[]> {
    return this.showtimeService.getAll();
  }

  
  @Get(':id')
getById(@Param('id') id: string): Promise<Showtime> {
  return this.showtimeService.getById(Number(id));
}

@Put(':id')
update(
  @Param('id') id: string,
  @Body() updatedShowtime: Partial<Showtime>
): Promise<Showtime> {
  return this.showtimeService.update(Number(id), updatedShowtime);
}

@Delete(':id')
delete(@Param('id') id: string): Promise<void> {
  return this.showtimeService.delete(Number(id));
}

}
