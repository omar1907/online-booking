/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @IsNotEmpty()
  @IsDate()
  startDate: string;

  @IsNotEmpty()
  @IsDate()
  endDate: string;

  // @IsNotEmpty()
  @IsString()
  paymentId: string;
}
