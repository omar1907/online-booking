import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer/signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto, 'Cutsomer');
  }

  @Post('admin/signup')
  async adminSignup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto, 'Admin');
  }

  @Post('login')
  async login(@Body() loginDto: SignInDto) {
    return this.authService.login(loginDto);
  }
}
