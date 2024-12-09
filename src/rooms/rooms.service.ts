import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/rooms.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AvailabilityStatusEnum } from './enum/available-status.enum';
import { RoomTypeEnum } from './enum/room-type.enum';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';

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
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
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

  async updateRoomStatus(id: number, statusDto: UpdateRoomStatusDto) {
    try {
      const room = await this.roomRepository.findOne({ where: { id } });
      if (!room) {
        this.logger.error(`No Room with id: ${id}`);
        return new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
      room.availabilityStatus = statusDto.status;

      await this.roomRepository.save(room);
      this.logger.info('Room status updated successfully');
      return {
        statusCode: HttpStatus.OK,
        message: 'Room status updated successfully',
        room,
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to update room status');
      throw new HttpException(
        'Failed to update room status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAll(query: {
    capacity?: number;
    availabilityStatus?: AvailabilityStatusEnum;
    pricePerNight?: number;
    roomType?: RoomTypeEnum;
    page?: number;
    limit?: number;
  }) {
    try {
      let { page = 1, limit = 10 } = query;
      page = Math.max(1, Number(page));
      const { capacity, availabilityStatus, pricePerNight, roomType } = query;
      const whereClause: any = {};
      if (capacity) {
        whereClause.capacity = capacity;
      }
      if (availabilityStatus) {
        whereClause.availabilityStatus = availabilityStatus;
      }

      if (pricePerNight) {
        whereClause.pricePerNight = pricePerNight;
      }

      if (roomType) {
        whereClause.roomType = roomType;
      }
      const [rooms, total] = await this.roomRepository.findAndCount({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
      });
      this.logger.info('Rooms found');
      return {
        statusCode: HttpStatus.OK,
        message: 'Rooms found',
        rooms,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to retrieve rooms');
      throw new HttpException(
        'Failed to create room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Room> {
    try {
      const room = await this.roomRepository.findOne({ where: { id } });
      if (!room) {
        this.logger.error(`No Room with id: ${id}`);
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      }
      this.logger.info('Room found');
      return room;
    } catch (error) {
      this.logger.error({ error }, 'Failed to retrieve room');
      throw new HttpException(
        'Failed to retrieve room',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllAvailableRooms() {
    try {
      const rooms = await this.roomRepository.find({
        where: { availabilityStatus: AvailabilityStatusEnum.AVAILABLE },
      });
      if (!rooms) {
        this.logger.info('No available rooms found');
        return new HttpException(
          'No available rooms found',
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.info('Available rooms found');
      return {
        statusCode: HttpStatus.OK,
        message: 'Available rooms found',
        rooms,
      };
    } catch (error) {
      this.logger.error({ error }, 'Failed to retrieve rooms');
      throw new HttpException(
        'Failed to retrieve rooms',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRoom(id: number) {
    const room = await this.roomRepository.delete(id);
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Room Deleted!',
    };
  }
}
