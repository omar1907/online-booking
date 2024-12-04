import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/rooms.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AvailabilityStatusEnum } from './enum/available-status.enum';

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
      this.logger.info('Room created successfully');
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

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      const room = await this.roomRepository.findOne({ where: { id } });
      if (!room) {
        this.logger.error(`No Room with id: ${id}`);
        return new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
      Object.assign(room, updateRoomDto);
      await this.roomRepository.save(room);
      this.logger.info('Room Updated successfully');
      return {
        statusCode: HttpStatus.OK,
        message: 'Room updated successfully',
        room,
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to create room');
      throw new HttpException(
        'Failed to update room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: {
    capacity?: number;
    availabilityStatus?: AvailabilityStatusEnum;
  }) {
    try {
      const { capacity, availabilityStatus } = query;
      const whereClause: any = {};
      if (capacity) {
        whereClause.capacity = capacity;
      }
      if (availabilityStatus) {
        whereClause.availabilityStatus = availabilityStatus;
      }

      const rooms = await this.roomRepository.find({ where: whereClause });
      this.logger.info('Rooms found');
      return {
        statusCode: HttpStatus.OK,
        message: 'Rooms found',
        rooms,
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to retrieve rooms');
      throw new HttpException(
        'Failed to create room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const room = await this.roomRepository.findOne({ where: { id } });
      if (!room) {
        this.logger.error(`No Room with id: ${id}`);
        return new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
      this.logger.info('Room found');
      return {
        statusCode: HttpStatus.OK,
        message: 'Room found',
        room,
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to retrieve rooms');
      throw new HttpException(
        'Failed to retrieve room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
