import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@/auth/roles/roles.decorator';
import { RolesEnum } from '@/auth/roles/roles.enum';
import { AuthGuard } from '@/auth/jwt-auth.guard';
import { RolesGuard } from '@/auth/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('')
  @UseGuards(AuthGuard)
  update(@Req() req: { userId: string }, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.userId, updateUserDto);
  }

  @Delete('')
  @UseGuards(AuthGuard)
  remove(@Req() req: { userId: string }) {
    return this.userService.remove(req.userId);
  }

  @UseGuards(AuthGuard)
  @Role(RolesEnum.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Post('change-user-role/:id')
  changeUserRole(@Param('id') id: string, @Body('role') role: RolesEnum) {
    return this.userService.changeUserRole(id, role);
  }
}
