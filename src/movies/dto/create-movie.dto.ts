import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max,
    IsInt,
  } from 'class-validator';
  
  export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    genre: string;
  
    @IsNumber()
    @Min(1)
    duration: number;
  
    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;
  
    @IsInt()
    @Min(1800)
    releaseYear: number;
  }
  