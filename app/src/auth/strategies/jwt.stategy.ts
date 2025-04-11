import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtPayload from '../interfaces/jwt-payload.interface';
import { JWT_SECRET_KEY } from '@/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET_KEY as string,
    });
  }

  validate(jwtPayload: JwtPayload) {
    return {
      userId: jwtPayload.userId,
    };
  }
}
