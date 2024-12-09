/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Between, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly userService: UsersService,
    private readonly roomsService: RoomsService,
  ) {}
  
  async createBooking(createBookingDto: CreateBookingDto) {
    const { userId, roomId, startDate, endDate } = createBookingDto;
    // 1- Validate user
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    // 2- Validate room
    const room = await this.roomsService.findOne(roomId);
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }
    // 3- Check room availability
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate)
    const overlappingBooking = await this.bookingRepository.findOne({
      where: [
        {
          room: { id: roomId },
          startDate: Between(parsedStartDate, parsedEndDate),
        },
        {
          room: { id: roomId },
          endDate: Between(parsedStartDate, parsedEndDate),
        },
      ],
    });

    if (overlappingBooking) {
      throw new BadRequestException('Room is already booked for the selected dates');
    }
    // 4- calc the total price
    const totalPrice = room.pricePerNight

    // 5- create and save booking
    const booking = this.bookingRepository.create({
      user: { id: userId },
      room: { id: roomId },
      // totalPrice,
      startDate : new Date(startDate),
      endDate: new Date(startDate),
    });

    return await this.bookingRepository.save(booking);
  }
}
