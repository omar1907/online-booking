/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { verifyToken } from '../utils/jwt';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

interface Payload extends jwt.JwtPayload {
  id?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(
        'User not authenticated, provide token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    let payload: Payload;
    try {
      payload = verifyToken(token) as Payload;

      const user = await this.usersService.findById(payload.id);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      request.user = user;
    } catch (err) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
