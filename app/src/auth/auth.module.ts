import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import {jwtConstants} from "@/auth/auth";
import {UserModule} from "@/user/user.module";
import { PassportModule } from '@nestjs/passport';
import {AuthController} from "@/auth/auth.controller";
import { AuthGuard } from './auth.guard';
import * as dotenv from 'dotenv';
dotenv.config()

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}