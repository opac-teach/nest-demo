import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth-input.dto';
import { Response } from 'express';
import { LoginResponseDto } from './dtos/auth-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UserResponseDto } from '@/user/dtos';
import { UserService } from '@/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const { token, user } = await this.authService.login(loginDto);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: `Bienvenue ${user.name}`,
    };
  }
}
