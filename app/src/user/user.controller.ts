import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Put,
  UseGuards,
  UnauthorizedException,
  Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/user/dto';
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@/auth/auth.guard";
import {UserGuard} from "@/user/user.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Returns a user' })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  @UseGuards(AuthGuard, UserGuard)
  update(
      @Param('id') id: string,
      @Body() user: UpdateUserDto): Promise<UserResponseDto> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'Returns the deleted user' })
  @UseGuards(AuthGuard, UserGuard)
  delete(
      @Param('id') id: string
  ): Promise<string> {
    return this.userService.delete(id);
  }
}
