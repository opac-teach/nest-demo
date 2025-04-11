import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CatService } from '@/cat/cat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly catService: CatService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':id/cats')
  findUserCat(@Param('id') id: string) {
    const ownerId = parseInt(id, 10);
    return this.catService.findCatsByUser(+id);
  }

 /* @Get(':id/cats')
  @ApiOperation({ summary: 'Get all cats by user id' })
  @ApiResponse({ status: 200, description: 'Returns all cats by user id' })
  findUserCats(@Param('id') id: string): Promise<CatResponseDto[]> {
    return this.catService.findCatsByOwner({ ownerId: id });
  }*/
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
