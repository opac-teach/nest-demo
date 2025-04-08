import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { userService } from '@/user/user.service';
import { UserResponseDto, CreateuserDto, UpdateuserDto } from '@/user/dtos';
import { RandomGuard } from '@/lib/random.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user') // route '/user'
@UseGuards(RandomGuard)
export class userController {
  constructor(private userService: userService) {}

  @Get('/') // GET '/user'
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id') // GET '/user/:id'
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Returns a user' })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id, true);
  }

  @Post() // POST '/user'
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() user: CreateuserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }

  @Put(':id') // PUT '/user/:id'
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  async update(
    @Param('id') id: string,
    @Body() user: UpdateuserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, user);
  }
}
