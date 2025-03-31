import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Showtime } from 'src/showtimes/showtime.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const showtime = await this.showtimeRepo.findOne({
      where: { id: dto.showtime_id },
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime ${dto.showtime_id} not found`);
    }

    const existing = await this.ticketRepo.findOne({
      where: {
        seat_number: dto.seat_number,
        showtime: { id: dto.showtime_id },
      },
    });

    if (existing) {
      throw new ConflictException('Seat already booked for this showtime');
    }

    const ticket = this.ticketRepo.create({
      seat_number: dto.seat_number,
      customer_name: dto.customer_name,
      showtime,
    });

    return this.ticketRepo.save(ticket);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketRepo.find({
      relations: ['showtime'],
    });
  }
  
}
