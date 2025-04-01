import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTicketDto {
  // Seat number to be booked (e.g., "A5")
  @IsString()
  @IsNotEmpty()
  seat_number: string;

  // Name of the customer booking the ticket
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  // ID of the showtime for which the ticket is booked
  @IsNumber()
  @Min(1)
  showtime_id: number;
}
