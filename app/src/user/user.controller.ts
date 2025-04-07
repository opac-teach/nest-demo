import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto, CreateUserDto, UpdateUserDto } from './dtos';
import { CatResponseDto } from '@/cat/dtos';
import { CatService } from '@/cat/cat.service';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly catService: CatService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll(true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Returns a user' })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id, true);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }

  @Get(':id/cats')
  @ApiOperation({ summary: 'Get all cats by user id' })
  @ApiResponse({ status: 200, description: 'Returns all cats by user id' })
  findCats(@Param('id') id: string): Promise<CatResponseDto[]> {
    return this.catService.findAll({
      userId: id,
      includeUser: true,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'Returns the deleted user' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
