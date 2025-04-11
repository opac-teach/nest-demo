import {Controller} from "@nestjs/common";
import {AuthService} from "@/auth/auth.service";
import {Body, Post} from "@nestjs/common";
import {RegisterDto} from "@/auth/dtos/register.dto";
import {ApiOperation, ApiBody} from "@nestjs/swagger";
import {LoginDto} from "@/auth/dtos/login.dto";

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    description: 'Login credentials',
    type: LoginDto,
  })
  @ApiOperation({ summary: 'Login' })
    async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto.email, LoginDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}