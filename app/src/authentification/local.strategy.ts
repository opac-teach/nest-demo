
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthentificationService } from './authentification.service'; 

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy ) {
  constructor(private AuthentificationService: AuthentificationService) {
    super({usernameField: 'username'});
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.AuthentificationService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
