import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FilterBookingsDto } from './dto/Filter-booking-dto';
import { Role } from 'src/auth/decorators/role.decorator';


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBooking(
    @Query() req,
    @Body()
    body: {
      bookingDto: CreateBookingDto;
      roomId: number;
    },
  ) {
    const userId = req.user.id;
    const { bookingDto, roomId } = body;
    return this.bookingsService.createBooking(bookingDto, userId, roomId);
  }

  @Role('admin')
  @Get()
  async getBookings(@Query() filterBookingsDto: FilterBookingsDto) {
    return await this.bookingsService.getBookings(filterBookingsDto);
  }

  @Delete(':id')
  async cancelBooking(@Param(':id') bookingId: number) {
    return await this.bookingsService.cancelBooking(bookingId);
  }

  @Get(':id')
  async getBookingById(@Param(':id') bookingId: number) {
    return await this.bookingsService.getBookingById(bookingId);
  }

  @Get()
  async getAllBookingsForUser(@Req() req) {
    const userId = req.user.id;
    return await this.bookingsService.getAllBookingsForUser(userId); 
  }

  @Get(':id')
  async getBookingByRoomId(@Param(':id') roomId: number) {
    return await this.bookingsService.getBookingByRoomId(roomId);
  }

  @Get()
  async bookingHistory(@Req() req) {
    const userId = req.user.id;
    return await this.bookingsService.bookingHistory(userId);
  }
}
