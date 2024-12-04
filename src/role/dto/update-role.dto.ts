import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString({ message: 'Role name must be a string' })
  name: string;
}
