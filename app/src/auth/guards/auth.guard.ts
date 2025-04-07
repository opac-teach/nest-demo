import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}

interface RequestWithCookies extends Request {
  cookies: {
    authToken?: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithCookies & RequestWithUser>();

    const token = (request as RequestWithCookies).cookies?.authToken;

    if (!token) {
      throw new UnauthorizedException("Vous n'êtes pas connecté !");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      (request as RequestWithUser).user = payload;
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new UnauthorizedException(`Token invalide: ${errorMessage}`);
    }
  }
}
