import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AvailabilityStatusEnum } from './enum/available-status.enum';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.create(createRoomDto);
  }

  @Get()
  async findAllRooms(
    @Query('capacity') capacity?: number,
    @Query('availabilityStatus') availabilityStatus?: AvailabilityStatusEnum,
  ) {
    return this.roomService.findAll({
      capacity: capacity ? capacity : undefined,
      availabilityStatus,
    });
  }

  @Get(':id')
  async findOneRoom(@Param('id') id: number) {
    return await this.roomService.findOne(id);
  }

  @Patch(':id')
  async updateRoom(
    @Param('id') id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return await this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  async deleteRoom(@Param('id') id: number) {
    return await this.roomService.deleteRoom(id);
  }
}
