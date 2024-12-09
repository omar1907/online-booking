/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { RoleModule } from 'src/role/role.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [UsersModule, RoleModule, MailModule ], 
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
