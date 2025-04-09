import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  SerializeOptions,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/auth-input.dto';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UserResponseDto } from '@/user/dtos';
import { UserService } from '@/user/user.service';
import { RequestWithUser, AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  register(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.register(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Returns a confirmation message' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { token, user } = await this.authService.login(loginDto);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      message: `Bienvenue ${user.name} !`,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({ status: 200, description: 'Returns the current user' })
  @SerializeOptions({ type: UserResponseDto })
  getMe(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return this.userService.findOne(req.user.sub);
  }
}
