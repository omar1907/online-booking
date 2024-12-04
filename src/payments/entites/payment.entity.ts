import { Booking } from 'src/bookings/entities/booking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MethodTypeEnum } from '../enum/method.enum';
import { StatusEnum } from 'src/payments/enum/status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column('decimal')
  amount: number;

  @Column({ default: StatusEnum.PENDING })
  status: StatusEnum;

  @Column()
  method: MethodTypeEnum;

  @Column({ unique: true })
  transaction_id: string;

  @Column('timestamp')
  payment_date: Date;
}
