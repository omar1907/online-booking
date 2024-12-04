import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async getRoleByName(roleName: string) {
    return await this.roleRepository.findOne({ where: { name: roleName } });
  }

  async updateRole(updateRoleDto: UpdateRoleDto, id: number) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    await this.roleRepository.update(id, updateRoleDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Role Updated Successfully',
      role,
    };
  }
  async getRoleById(id: number) {
    return await this.roleRepository.findOne({ where: { id } });
  }

  async createRole(createRole: CreateRoleDto) {
    const newRole = this.roleRepository.create(createRole);
    const role = await this.roleRepository.save(newRole);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Role Created Successfully',
      role,
    };
  }
}
