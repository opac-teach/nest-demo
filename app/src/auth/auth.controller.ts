
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import {SignInDto} from "@/auth/dto/auth-input.dto";
import {ApiOperation, ApiProperty, ApiResponse} from "@nestjs/swagger";
import {CreateUserDto, UserResponseDto} from "@/user/dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Login user with username and password' })
    @ApiResponse({ status: 200, description: 'Returns a access token' })
    login(@Body() data: SignInDto) {
        return this.authService.signIn(data.username, data.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 201, description: 'Returns user created' })
    register(@Body() user: CreateUserDto): Promise<UserResponseDto> {
        return this.authService.register(user);
    }
}
