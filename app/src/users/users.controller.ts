import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RandomGuard } from '@/lib/random.guard';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
 
@Controller('users')  
@UseGuards(RandomGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get('/')
  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'Returns all Users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'Returns all Users' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'Returns the deleted user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
