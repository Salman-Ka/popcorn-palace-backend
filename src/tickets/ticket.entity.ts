import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Ticket {
  // Auto-generated unique identifier for the ticket
  @PrimaryGeneratedColumn()
  id: number;

  // Seat number assigned to the ticket (e.g., "A5")
  @Column()
  seat_number: string;

  // Name of the customer who booked the ticket
  @Column()
  customer_name: string;

  // Associated showtime (many tickets can belong to one showtime)
  // 'eager: true' automatically loads showtime details when querying a ticket
  @ManyToOne(() => Showtime, (showtime) => showtime.tickets, { eager: true })
  showtime: Showtime;
}
