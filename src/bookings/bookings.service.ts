/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { StatusEnum } from './enums/booking-status.enum';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { FilterBookingsDto } from './dto/Filter-booking-dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UsersService,
    private readonly roomsService: RoomsService,
    private readonly mailService: MailService,
  ) {}

  async createBooking(
    bookingDto: CreateBookingDto,
    userId: number,
    roomId: number,
  ) {
    const user = await this.userService.findById(userId);
    const room = await this.roomsService.findOne(roomId);
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
    if (room.capacity < 0) {
      throw new BadRequestException(
        `Room cannot accommodate ${room.capacity} guests`,
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

    const Msg = `'Notification Booking Created at Room ' : ${booking.room}`;
    await this.mailService.notifyUser(user.email, Msg);

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
    const duration = Math.ceil(durationInMilliseconds / (1000 * 60 * 60 * 24));
    return duration;
  }

  async getBookings(filterBookingsDto: FilterBookingsDto) {
    const { userId, roomId, startDate, endDate } = filterBookingsDto;

    const where: any = {};
    if (userId) where.user = { id: userId };
    if (roomId) where.room = { id: roomId };
    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
      where.startDate = Between(parsedStartDate, parsedEndDate);
    }

    return await this.bookingRepository.find({
      where,
      relations: ['user', 'room'],
    });
  }

  async cancelBooking(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    booking.status = StatusEnum.CANCELED;

    await this.bookingRepository.remove(booking);
  }

  async getBookingById(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return booking;
  }
  async getAllBookingsForUser(userId: number) {
    const bookings = await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'room'],
    });

    if (bookings.length === 0) {
      throw new NotFoundException(
        userId
          ? `No bookings found for user with ID ${userId}`
          : 'No bookings found',
      );
    }
    return bookings;
  }

  async getBookingByRoomId(roomId: number) {
    const bookings = await this.bookingRepository.find({
      where: { room: { id: roomId } },
      relations: ['user', 'room'],
    });

    if (bookings.length === 0) {
      throw new NotFoundException(
        `No bookings found for room with ID ${roomId}`,
      );
    }
    return bookings;
  }

  async bookingHistory(userId: number) {
    const bookings = await this.bookingRepository.find({
      where: { user: { id: userId }, status: StatusEnum.CONFIRMED },
      relations: ['user', 'room'],
    });

    if (!bookings) {
      throw new NotFoundException(
        `No bookings found for user with ID ${userId}`,
      );
    }
    return {
      message: 'Completed Booking Histoty Retrevid',
      DataLength: bookings.length,
      bookings,
    };
  }
}
