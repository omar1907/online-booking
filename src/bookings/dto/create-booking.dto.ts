/* eslint-disable prettier/prettier */
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
  
  @IsNotEmpty()
  roomId: number;
}
