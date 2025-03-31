import {
    IsString,
    IsNumber,
    IsDateString,
    Min,
    IsNotEmpty,
  } from 'class-validator';
  
  export class CreateShowtimeDto {
    @IsString()
    @IsNotEmpty()
    theater: string;
  
    @IsDateString()
    start_time: string;
  
    @IsDateString()
    end_time: string;
  
    @IsNumber()
    @Min(1)
    price: number;
  
    @IsNumber()
    @Min(1)
    movie: number; // the movie ID
  }
  