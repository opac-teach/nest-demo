
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Authentification'})
  @ApiBody({type:AuthDto})
  signIn(@Body() signIn: AuthDto) : Promise<AuthResponseDto> {
    return this.authService.signIn(signIn.name, signIn.password);
  }
}
