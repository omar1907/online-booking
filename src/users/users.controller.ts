import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/auth/decorators/role.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { User } from './entites/user.entity';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('User')
  async getMe(@Req() req: any): Promise<User> {
    return await this.usersService.findById(req.user.id);
  }

  @Post('')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('Admin')
  async create(@Body() body: { user: Partial<User>; roleName: string }) {
    return await this.usersService.create(body.user, body.roleName);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('Admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { user: Partial<User> },
  ) {
    return await this.usersService.updateUser(id, body.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('Admin')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }

  @Put('/profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role('User')
  async updateProfile(@Req() req, @Body() updateData: Partial<User>) {
    const { id } = req.user.id;
    return await this.usersService.updateUser(id, updateData);
  }
}
