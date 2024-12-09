import { IsEnum } from 'class-validator';
import { AvailabilityStatusEnum } from '../enum/available-status.enum';

export class UpdateRoomStatusDto {
  @IsEnum(AvailabilityStatusEnum)
  status: AvailabilityStatusEnum;
}
