import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
