/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async create(user: Partial<User>, roleName: string): Promise<User> {
    const role = await this.roleService.getRoleByName(roleName);

    if (!role) throw new HttpException('Role not found', HttpStatus.NOT_FOUND);

    const newUser = this.userRepository.create({ ...user, role });
    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUser(id: number, user: Partial<User>) {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(id, { ...user });

    return {
      statusCode: HttpStatus.OK,
      message: 'User Updated Successfully',
      userToUpdate,
    };
  }

  async updateUserProfile(id: number, user: Partial<User>) {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });
    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(id, { ...user });

    return {
      statusCode: HttpStatus.OK,
      message: 'User Updated Successfully',
      userToUpdate,
    };
  }

  
  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User Deleted Successfully',
    };
  }

  async updateResetToken(userId: number, resetCode: string): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      {
        resetCode,
        resetCodeExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1-hour expiry time
      },
    );
  }

  async findOneByresetCode(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { resetCode: token, resetCodeExpiry: MoreThan(new Date()) },
    });
    if (!user) {
      throw new NotFoundException(
        `UserId who have token : ${token} Not Found!`,
      );
    }
    return user;
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { password: newPassword },
    );
  }

  async clearResetCode(userId: number) {
    await this.userRepository.update(
      { id: userId },
      { resetCode: null, resetCodeExpiry: null },
    );
  }
}
