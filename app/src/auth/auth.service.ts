import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/auth-input.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/user/dtos';
import { UserEntity } from '@/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; user: UserEntity }> {
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  async register(user: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await this.userService.create({ ...user, password: hashedPassword });
  }
}
