import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
