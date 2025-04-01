import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Showtime {
  // Auto-incremented primary key
  @PrimaryGeneratedColumn()
  id: number;

  // Many showtimes can be associated with one movie
  @ManyToOne(() => Movie)
  movie: Movie;

  // The name or identifier of the theater where the showtime takes place
  @Column()
  theater: string;

  // The start time of the show (stored as a timestamp)
  @Column({ type: 'timestamp' })
  start_time: Date;

  // The end time of the show (stored as a timestamp)
  @Column({ type: 'timestamp' })
  end_time: Date;

  // Ticket price for the showtime
  @Column('float')
  price: number;

  // One showtime can have many associated tickets
  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
  tickets: Ticket[];
}
