import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/signin.dto';
import { createJwt, createToken } from './utils/jwt';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RoleService,
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
    return {
      statusCode: HttpStatus.OK,
      message: `${role} Signed Up Successfully`,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        phone: user.phoneNumber,
      },
    };
  }

  async signIn(singInDto: SignInDto) {
    try {
      const user = await this.userService.findByEmail(singInDto.email);

      if (!user || !(await bcrypt.compare(singInDto.password, user.password))) {
        throw new HttpException('Invalid Credentials ', HttpStatus.BAD_REQUEST);
      }
      const role = await this.roleService.getRoleById(user.role.id);

      const userToken = createToken(user, role);
      const token = createJwt({ payload: userToken });

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
      console.log(error);

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error,
      };
    }
  }
}
