import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReservationDto {
  
  @IsNumber()
  @IsNotEmpty()
  reservationid: number;

  @IsNumber()
  @IsNotEmpty() 
  creneau: number;
}
