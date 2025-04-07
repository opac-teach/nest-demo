import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // TODO: split this into a separate middleware
    const token = this.extractTokenFromHeader(
      context.switchToHttp().getRequest(),
    );
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: {
        sub: string;
      } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const request: {
        userId: string;
      } = context.switchToHttp().getRequest();
      request.userId = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
