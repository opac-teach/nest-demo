import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RandomGuard } from '@/lib/random.guard';
import { AuthGuard } from '@/auth/auth.guard';


import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
 
@Controller('users')  
@UseGuards(RandomGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get('/')
  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'Returns all Users' })
  findAll() {
    return this.usersService.findAll({ includeCommentary: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all Users' })
  @ApiResponse({ status: 200, description: 'Returns all Users' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id, { includeCommentary: true });
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put('update')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(updateUserDto, req.user.sub);
  }

  @Delete('delete/:id')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'Returns the deleted user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
