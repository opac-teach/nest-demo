import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: {
      userId: string;
      headers: {
        authorization: string;
      };
    } = context.switchToHttp().getRequest();
    if (!request.userId) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
