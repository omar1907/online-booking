/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'First Name must be a string' })
  readonly firstName: string;

  @IsString({ message: 'Last Name must be a string' })
  readonly lastName: string;
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9\s]).{3,}$/, {
    message:
      'Password must contain at least one special character, one numeric character, and one alphabetical character',
  })
  readonly password: string;
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Phone number must be in a valid international format (e.g., +1234567890)',
  })
  readonly phoneNumber: string;

  roleName: string;
}
