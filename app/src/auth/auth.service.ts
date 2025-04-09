import { Injectable } from '@nestjs/common';
import {UserService} from "@/user/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return this.userService.create({
      username: registerDto.username,
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      email: registerDto.email,
      password: registerDto.password
    });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; // on déstructure pour exclure le password de l'objet à retourner.
      return result;
    }
    return null;
  }

  async login(email: string, password:string): Promise<{ accessToken: string}>{
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
