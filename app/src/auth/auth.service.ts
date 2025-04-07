
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {UserService} from "@/user/user.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {CreateUserDto, UserResponseDto} from "@/user/dto";
import {UserEntity} from "@/user/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(
        username: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        const user = await this.userService.findOneByEmail(username);
        if (user && await bcrypt.compare(pass, user.password)) {
            const payload = { sub: user?.id, username: user?.email };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        }
        throw new UnauthorizedException();
    }

    async register(user: CreateUserDto): Promise<UserEntity> {
        return await this.userService.create(user)
    }
}
