import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
      return true;
    const requiredRoles =
      this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // If no roles defined → allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(request,'======');
    console.log(requiredRoles,'====09090000==');
    

    if (!user?.role) {
      throw new ForbiddenException('No role found');
    }

    const hasRole = requiredRoles.includes(Number(user.role));

    if (!hasRole) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}