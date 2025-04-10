import {
  Controller,
  Post,
  Body,
  SerializeOptions,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/user/dtos/user-input.dto';
import { UserResponseDto } from '@/user/dtos/user-response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '@/user/user.service';
import { AuthResponseDto } from './dto/auth-response';
import { LoginAuthDto } from './dto/auth-input';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register') // POST '/register'
  @SerializeOptions({ type: UserResponseDto })
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'Returns the registered user',
    type: UserResponseDto,
  })
  register(@Body() userInputDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(userInputDto);
  }

  @Post('login') // POST '/login'
  @SerializeOptions({ type: AuthResponseDto })
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 201,
    description: 'Returns the logged user',
    type: AuthResponseDto,
  })
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(
      loginAuthDto.email,
      loginAuthDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.generateToken(user);
  }
}
