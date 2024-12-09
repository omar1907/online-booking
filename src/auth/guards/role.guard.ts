import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.userRole) {
      return false;
    }

    // Check if user's role matches any of the required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have the necessary permissions to access this resource.',
      );
    }

    return requiredRoles.includes(user.userRole);
  }
}
