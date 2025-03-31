import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  seat_number: string;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsNumber()
  @Min(1)
  showtime_id: number;
}
