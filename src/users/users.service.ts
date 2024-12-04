import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
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

  async userBookings() {}
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
}
