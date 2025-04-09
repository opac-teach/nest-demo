import {UserService} from "@/user/user.service";
import {Controller, Body, Post, Get, Param, Put, Delete, UseGuards} from "@nestjs/common";
import {CreateUserDto, UpdateUserDto} from "@/user/dtos/user-input.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserResponseDto} from "@/user/dtos/user-response.dto";
import {CatResponseDto} from "@/cat/dtos";
import {CatService} from "@/cat/cat.service";
import { AuthGuard} from "@/auth/auth.guard";



@Controller('user')
export class UserController{
  constructor(
    private userService: UserService,
    private catService: CatService
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users', type:UserResponseDto})
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by his id' })
  @ApiResponse({ status: 200, description: 'User' })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Get(':id/cats')
  @ApiOperation({ summary: 'Get all cats belongs to specific user by his id' })
  @ApiResponse({ status: 200, description: 'All cats was retrieve.' })
  findCatsByUserId(@Param('id') id: string): Promise<CatResponseDto[]> {
    return this.catService.findAll({ userId: id });
  }

  // @Put(':id')
  // @ApiOperation({ summary: 'This endpoint allow you to update user information' })
  // @ApiResponse({ status: 200, description: 'User information successfully updated' })
  // async update(
  //   @Param('id') id: string,
  //   @Body() user: UpdateUserDto,
  // ): Promise<UserResponseDto> {
  //   return this.userService.update(id, user);
  // }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'This endpoint allow you to delete user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}