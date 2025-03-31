import { Controller, Post, Body, Get } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './ticket.entity';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async book(@Body() dto: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.createTicket(dto);
  }

  @Get()
async getAll(): Promise<Ticket[]> {
  return this.ticketsService.getAllTickets();
}
}
