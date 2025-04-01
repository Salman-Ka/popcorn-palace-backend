import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './ticket.entity';
import { Showtime } from '../showtimes/showtime.entity';

@Module({
  // Register Ticket and Showtime entities for dependency injection with TypeORM
  imports: [TypeOrmModule.forFeature([Ticket, Showtime])],

  // Expose the TicketsController to handle incoming HTTP requests
  controllers: [TicketsController],

  // Register the TicketsService for business logic
  providers: [TicketsService],
})
export class TicketsModule {}
