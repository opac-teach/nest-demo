import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserBodyDto } from '@/users/dto/usersBodyDto';
import { UsersInterceptor } from '@/users/users.interceptor';
import { Public } from '@/publicRoutes';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post("/createUser")
  async createUser(@Body() createUserBodyDto : CreateUserBodyDto ) {
      return this.usersService.createUser(createUserBodyDto)
  }

}
