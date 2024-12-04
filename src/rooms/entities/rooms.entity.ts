import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AvailabilityStatusEnum } from '../enum/available-status.enum';
import { RoomTypeEnum } from '../enum/room-type.enum';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('int')
  capacity: number;

  @Column()
  roomType: RoomTypeEnum;

  @Column('decimal')
  pricePerNight: number;

  @Column()
  availabilityStatus: AvailabilityStatusEnum;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
