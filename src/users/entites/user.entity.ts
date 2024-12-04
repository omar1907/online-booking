import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/role/entities/role.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @BeforeInsert()
  async hashPassword() {
    console.log('Hashing password:', this.password); // Debug log
    this.password = await bcrypt.hash(this.password, 10);
    console.log('Hashed password:', this.password); // Debug log
  }
}
