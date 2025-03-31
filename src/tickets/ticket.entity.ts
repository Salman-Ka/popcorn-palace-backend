import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seat_number: string;

  @Column()
  customer_name: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets, { eager: true })
  showtime: Showtime;
}
