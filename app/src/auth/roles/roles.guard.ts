import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request: { role: string } = context.switchToHttp().getRequest();
    const userRole: string | RolesEnum = request['role'];

    if (!userRole) {
      return false;
    }

    const role = this.reflector.get<string>('role', context.getHandler());

    const userRoleIndex = Object.values(RolesEnum).indexOf(
      userRole as RolesEnum,
    );
    const roleIndex = Object.values(RolesEnum).indexOf(role as RolesEnum);

    if (userRoleIndex === -1 || roleIndex === -1) {
      return false;
    }

    return userRoleIndex >= roleIndex;
  }
}
