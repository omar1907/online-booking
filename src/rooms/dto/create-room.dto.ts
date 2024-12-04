import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Entity } from 'typeorm';
import { RoomTypeEnum } from '../enum/room-type.enum';
import { Type } from 'class-transformer';
import { AvailabilityStatusEnum } from '../enum/available-status.enum';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  roomNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsNotEmpty()
  @IsEnum(RoomTypeEnum)
  roomType: RoomTypeEnum;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  pricePerNight: number;

  @IsNotEmpty()
  @IsEnum(AvailabilityStatusEnum)
  availabilityStatus: AvailabilityStatusEnum;
}
