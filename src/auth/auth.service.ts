/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { SignInDto } from './dto/signin.dto';
import { createJwtToken, createPayload } from './utils/jwt';
import { RoleService } from 'src/role/role.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
  ) {}

  async signUp(signUpDto: SignUpDto, role: string) {
    const isExist = await this.userService.findByEmail(signUpDto.email);
    if (isExist) {
      throw new HttpException(
        'Email is already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.create(signUpDto, role);
    const userToken = createPayload(user, role);
    const token = createJwtToken(userToken);
    return {
      statusCode: HttpStatus.OK,
      message: `${role} Signed Up Successfully`,
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        phone: user.phoneNumber,
      },
    };
  }

  async login(loginDto: SignInDto) {
    try {
      const user = await this.userService.findByEmail(loginDto.email);
      const Pass = await bcrypt.compare(loginDto.password, user.password)

      if (!user || !Pass) {
        throw new HttpException('Invalid Credentials ', HttpStatus.BAD_REQUEST);
      }
      const role = await this.roleService.getRoleById(user.role.id);

      const userToken = createPayload(user, role);
      const token = createJwtToken({ payload: userToken });

      return {
        statusCode: HttpStatus.OK,
        message: 'Logged in Successfully',
        token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: role.name,
          phone: user.phoneNumber,
        },
      };
    } catch (error) {
      console.log(error.message);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error,
      };
    }
  }

    async forgetPassword(email: string):Promise<{message: string}> {
      const user = await this.userService.findByEmail(email)
      if(!user) {
        throw new UnauthorizedException('Invalid email')
      }
      const resetCode = crypto.randomBytes(20).toString('hex')
      const hashedCode = await bcrypt.hash(resetCode, 10);

      await this.userService.updateResetToken(user.id, hashedCode);
      const resetCodeMsg = `To reset your password, take the following token code: ${resetCode}`;
      await this.mailService.sendPasswordReset(user.email, resetCodeMsg);
  
      return { message: 'Password reset link sent to your email' };
    }

    async resetPassword(resetCode: string , newPassword: string ): Promise<{ message: string; token: string }> {
      const user = await this.userService.findOneByresetCode(resetCode);
      if (!user || (await bcrypt.compare(resetCode, user.resetCode))) {
        throw new UnauthorizedException('Invalid or expired reset resetCode');
      }
      await this.userService.updatePassword(user.id, newPassword);
      await this.userService.clearResetCode(user.id);
  
      // Generate a new access resetCode
      const userToken = createPayload(user, user.role);
      const token = createJwtToken({ payload: userToken });
      return { message: 'Password reset successful', token };
    }
}
