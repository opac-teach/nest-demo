import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User email' })
  @ApiResponse({ status: 201, description: 'Returns the access token' })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
