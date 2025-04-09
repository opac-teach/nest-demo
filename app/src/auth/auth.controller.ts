import { Body, Controller, Get, Post, Request,  } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthBodyDto } from '@/auth/dtos/authBodyDto';
import { Public } from '@/publicRoutes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async  login(@Body() authBodyDto : AuthBodyDto ) {
    return await this.authService.login(authBodyDto);
  }

  @Get("profile")
  async  getAuth(@Request() req ) {
    return  await this.authService.getProfile(req.user.username);
  }
}
