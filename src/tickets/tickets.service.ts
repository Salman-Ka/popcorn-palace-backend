import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Showtime } from '../showtimes/showtime.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,
  ) {}

  // Book a new ticket with seat and showtime validation
  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    // Check if the showtime exists
    const showtime = await this.showtimeRepo.findOne({
      where: { id: dto.showtime_id },
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime ${dto.showtime_id} not found`);
    }

    // Check if the seat is already booked for this showtime
    const existing = await this.ticketRepo.findOne({
      where: {
        seat_number: dto.seat_number,
        showtime: { id: dto.showtime_id },
      },
    });

    if (existing) {
      throw new ConflictException('Seat already booked for this showtime');
    }

    // Create and save the new ticket
    const ticket = this.ticketRepo.create({
      seat_number: dto.seat_number,
      customer_name: dto.customer_name,
      showtime,
    });

    return this.ticketRepo.save(ticket);
  }

  // Retrieve all booked tickets with their associated showtimes
  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketRepo.find({
      relations: ['showtime'],
    });
  }
}
