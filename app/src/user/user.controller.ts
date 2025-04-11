import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
  SerializeOptions
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserResponseDto, CreateuserDto, UpdateuserDto } from '@/user/dtos';
import { RandomGuard } from '@/lib/random.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user') // route '/user'
export class userController {
  constructor(private userService: UserService) {}

  @Get('/') // GET '/user'
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @SerializeOptions({type: UserResponseDto})
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id') // GET '/user/:id'
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Returns a user' })
  @SerializeOptions({type: UserResponseDto})
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Post() // POST '/user'
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() user: CreateuserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id') // PUT '/user/:id'
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  async update(
    @Param('id') id: string,
    @Body() user: UpdateuserDto,
    @Req() req,
  ): Promise<UserResponseDto> {
    console.log("zedfergtrg" , req.user)

    if (id !== req.user.userId) { 
      throw new ForbiddenException("you can modify only your profile !");
    }
    return this.userService.update(id, user);
  }
}
