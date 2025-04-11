import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      @InjectRepository(UserEntity)
      private readonly userRepo: Repository<UserEntity>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUserDto = { ...createUserDto, password: hashedPassword };

    const user = await this.userService.create(newUserDto);
    const { password, ...result } = user;
    return result;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userRepo.findOneBy({ email: loginAuthDto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}