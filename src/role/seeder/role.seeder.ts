import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    const roles = ['Admin', 'Customer'];
    for (const roleName of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (!existingRole) {
        const role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
      }
    }
  }
}
