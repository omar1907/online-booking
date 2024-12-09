import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Room } from 'src/rooms/entities/rooms.entity';
import { AvailabilityStatusEnum } from 'src/rooms/enum/available-status.enum';
import { StatusEnum } from './enums/booking-status.enum';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UsersService,
    private readonly roomService: RoomsService,
  ) {}

  async createBooking(
    bookingDto: CreateBookingDto,
    userId: number,
    roomId: number,
  ) {
    const user = await this.userService.findById(userId);
    const room = await this.roomService.findOne(roomId);
    const isRoomAvailable = await this.isRoomAvailable(
      roomId,
      bookingDto.startDate,
      bookingDto.endDate,
    );

    console.log('Room Availability: ', isRoomAvailable);

    if (!isRoomAvailable) {
      throw new HttpException(
        'The room is already booked for the selected dates.',
        HttpStatus.CONFLICT,
      );
    }
    const duration = this.calculateBookingDuration(
      bookingDto.startDate,
      bookingDto.endDate,
    );

    const totalPrice = duration * room.pricePerNight;
    const booking = this.bookingRepository.create({
      ...bookingDto,
      totalPrice,
      status: StatusEnum.PENDING,
    });
    booking.user = user;
    booking.room = room;
    await this.bookingRepository.save(booking);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Booking created successfully',
      booking,
    };
  }

  private async isRoomAvailable(
    roomId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const overlappingBooking = await this.bookingRepository.findOne({
      where: [
        {
          room: { id: roomId },
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(startDate),
        },
      ],
    });
    console.log('OverlapBooking: ', overlappingBooking);

    return !overlappingBooking;
  }
  private calculateBookingDuration(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new HttpException(
        'Invalid booking dates. endDate must be after startDate.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const durationInMilliseconds = end.getTime() - start.getTime();
    return Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
  }
}
