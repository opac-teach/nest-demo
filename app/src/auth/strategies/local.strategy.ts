import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from '@/user/user.entity';
import { LoginAuthDto } from '../dto/auth-input';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(loginAuthDto: LoginAuthDto): Promise<UserEntity> {
    const userToValidate = await this.authService.validateUser(
      loginAuthDto.email,
      loginAuthDto.password,
    );
    if (!userToValidate) {
      throw new UnauthorizedException();
    }
    return userToValidate;
  }
}
