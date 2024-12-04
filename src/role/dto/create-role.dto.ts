import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Role name must be a string' })
  name: string;
}
