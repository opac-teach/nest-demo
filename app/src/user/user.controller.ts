import {UserService} from "@/user/user.service";
import {Controller, Body, Post, Get} from "@nestjs/common";
import {CreateUserDto} from "@/user/dtos/user-input.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserResponseDto} from "@/user/dtos/user-response.dto";

@Controller('user')
export class UserController{
  constructor(private userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'Returns the created user' })
  create(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }
}