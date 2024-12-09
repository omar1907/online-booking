import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatusEnum } from '../enums/booking-status.enum';
import { User } from 'src/users/entites/user.entity';
import { Room } from 'src/rooms/entities/rooms.entity';
import { Payment } from 'src/payments/entites/payment.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: StatusEnum.PENDING })
  status: StatusEnum;

  @Column('decimal')
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Room, (room) => room.bookings, { eager: true })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @OneToOne(() => Payment, (payment) => payment.booking, { eager: true })
  payment: Payment;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
