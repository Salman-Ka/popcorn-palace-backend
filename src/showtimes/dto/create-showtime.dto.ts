import {
  IsString,
  IsNumber,
  IsDateString,
  Min,
  IsNotEmpty,
} from 'class-validator';

// Data Transfer Object for creating a new showtime
export class CreateShowtimeDto {
  // Name of the theater (must be a non-empty string)
  @IsString()
  @IsNotEmpty()
  theater: string;

  // Start time of the show (must be a valid ISO date string)
  @IsDateString()
  start_time: string;

  // End time of the show (must be a valid ISO date string)
  @IsDateString()
  end_time: string;

  // Ticket price (must be a number greater than or equal to 1)
  @IsNumber()
  @Min(1)
  price: number;

  // ID of the associated movie (must be a number greater than or equal to 1)
  @IsNumber()
  @Min(1)
  movie: number; // the movie ID
}
