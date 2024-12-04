import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/rooms.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectPinoLogger(RoomsService.name) private readonly logger: PinoLogger,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const room = this.roomRepository.create(createRoomDto);
      await this.roomRepository.save(room);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Room created successfully',
        room,
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to create room');
      throw new HttpException(
        'Failed to create room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(updateRoomDto: UpdateRoomDto, id: number) {
    try {
      const room = await this.roomRepository.findOne({ where: { id } });
      if (!room) {
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {}
  }
}
