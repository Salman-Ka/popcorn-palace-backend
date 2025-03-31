import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number; // in minutes

  @Column('float')
  rating: number;

  @Column({ name: 'release_year' })
  releaseYear: number;
}
