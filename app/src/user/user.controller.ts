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
import {OwnerGuard} from "@/user/user.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get user info connected' })
  @ApiResponse({ status: 200, description: 'Returns the connected user' })
  @UseGuards(AuthGuard)
  async me(@Request() req): Promise<UserResponseDto> {
    return await this.userService.findOne(req.user.sub);
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
  @UseGuards(AuthGuard, OwnerGuard)
  async update(
      @Param('id') id: string,
      @Body() user: UpdateUserDto): Promise<UserResponseDto> {
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'Returns the deleted user' })
  @UseGuards(AuthGuard, OwnerGuard)
  async delete(
      @Param('id') id: string
  ): Promise<{}> {
    const result: string = await this.userService.delete(id);

    return { message: result }
  }
}
