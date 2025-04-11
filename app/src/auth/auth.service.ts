import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@/user/user.entity';
import JwtPayload from './interfaces/jwt-payload.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      this.eventEmitter.emit('data.crud', {
        action: 'create',
        model: 'user',
        user: user,
      });

      return user;
    }

    return null;
  }

  generateToken(user: UserEntity): { accessToken: string } {
    const payload: JwtPayload = { userId: user.id };

    const accessToken = this.jwtService.sign(payload);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'auth',
      auth: accessToken,
    });

    return {
      accessToken,
    };
  }
}
