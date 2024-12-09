import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AvailabilityStatusEnum } from './enum/available-status.enum';
import { RoomTypeEnum } from './enum/room-type.enum';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.create(createRoomDto);
  }

  @Get()
  async findAllRooms(
    @Query('capacity') capacity?: number,
    @Query('availabilityStatus') availabilityStatus?: AvailabilityStatusEnum,
    @Query('pricePerNight') pricePerNight?: number,
    @Query('roomType') roomType?: RoomTypeEnum,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.roomService.findAll({
      capacity: capacity ? Number(capacity) : undefined,
      availabilityStatus: availabilityStatus as AvailabilityStatusEnum,
      pricePerNight: pricePerNight ? Number(pricePerNight) : undefined,
      roomType: roomType as RoomTypeEnum,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
  }

  @Get(':id')
  async findOneRoom(@Param('id') id: number) {
    return await this.roomService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  @Patch(':id')
  async updateRoom(
    @Param('id') id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return await this.roomService.update(id, updateRoomDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  @Patch(':id/status')
  async updateRoomStatus(
    @Param('id') id: number,
    @Body() status: UpdateRoomStatusDto,
  ) {
    return this.roomService.updateRoomStatus(id, status);
  }

  @Get('available')
  async findAllAvailableRooms() {
    return await this.roomService.findAllAvailableRooms();
  }
}
