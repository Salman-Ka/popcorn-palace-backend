// Represents the Movie entity for the movies table in the database
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // Decorates the class to mark it as a database entity
export class Movie {
  @PrimaryGeneratedColumn() // Auto-generated unique identifier for each movie
  id: number;

  @Column() // Title of the movie (required)
  title: string;

  @Column() // Genre/category of the movie (e.g., Action, Comedy)
  genre: string;

  @Column() // Duration of the movie in minutes
  duration: number;

  @Column('float') // Movie rating (e.g., 7.8)
  rating: number;

  @Column({ name: 'release_year' }) // Release year of the movie
  releaseYear: number;
}
