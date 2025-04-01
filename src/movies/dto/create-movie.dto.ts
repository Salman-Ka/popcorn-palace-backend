import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsInt,
} from 'class-validator';

export class CreateMovieDto {
  @IsString() // Must be a string
  @IsNotEmpty() // Cannot be empty
  title: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsNumber() // Must be a number
  @Min(1) // Minimum duration is 1 minute
  duration: number;

  @IsNumber()
  @Min(0) // Rating can't be less than 0
  @Max(10) // Rating can't exceed 10
  rating: number;

  @IsInt() // Must be an integer
  @Min(1800) // Reasonable earliest year for a movie
  releaseYear: number;
}
