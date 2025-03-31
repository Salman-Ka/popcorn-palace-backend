import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Ticket } from '../tickets/ticket.entity';


@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie)
  movie: Movie;

  @Column()
  theater: string;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column('float')
  price: number;  

  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
tickets: Ticket[];

}
