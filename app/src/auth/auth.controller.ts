import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInDto } from './dtos/auth-input.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
 
  @Post('login')
  @ApiOperation({ summary: 'Sign in as user' })
  @ApiResponse({ status: 200, description: 'Returns JWT Token' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
