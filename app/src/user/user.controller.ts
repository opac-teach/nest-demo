import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CatService } from "@/cat/cat.service";
import { ApiBearerAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import { CatResponseDto } from "@/cat/dtos";
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';


@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService, private readonly catService: CatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'The user has been created' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users ' })
  findAll()
  {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Returns user by id' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Patch a user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get(':id/cats')
  @ApiOperation({ summary: 'Get all cats by user' })
  @ApiResponse({ status: 200, description: 'Returns all cats by user' })
  findAllCats(@Param('id') id: string): Promise<CatResponseDto[]> {
    return this.catService.findAll({ userId: id });
  }
}
