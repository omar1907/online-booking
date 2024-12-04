import { Body, Controller, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.create(createRoomDto);
  }
}
