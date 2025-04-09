import { Body, Controller, Post, Get, Request, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SignInDto } from './dtos/auth-input.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
 
  @Post('login')
  @ApiOperation({ summary: 'Sign in as user' })
  @ApiResponse({ status: 200, description: 'Returns JWT Token' })
  signIn(@Body() signInDto: SignInDto) {
    console.log(process.env.SECRET_KEY);  
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'WHOAMI' })
  @ApiResponse({ status: 200, description: 'WHOAMI' })
  getProfile(@Request() req) {
    return req.user;
  }
}
