import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { RolesEnum } from '@/auth/roles/roles.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as process from 'node:process';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {
    this.use = this.use.bind(this);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req);
    const token = this.extractTokenFromHeader(req);

    if (token) {
      try {
        const payload: { sub: string; role: RolesEnum } =
          await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET || 'secret',
          });
        req['userId'] = payload.sub;
        req['role'] = payload.role;
      } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
