import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('/')
  async createBooking(
    @Body()
    body: {
      bookingDto: CreateBookingDto;
      roomId: number;
    },
  ) {
    const { bookingDto, roomId } = body;
    return this.bookingsService.createBooking(bookingDto, 2, roomId);
  }
}
