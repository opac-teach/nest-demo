import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  SerializeOptions,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/user-input.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dtos/user-response.dto';
import { CatResponseDto } from '@/cat/dtos';
import { CatService } from '@/cat/cat.service';
import RequestUserInformations from '@/interfaces/request-user-informations.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('user') // route '/user'
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly catService: CatService,
  ) {}

  @Get() // GET '/user'
  @SerializeOptions({ type: UserResponseDto })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: UserResponseDto,
    isArray: true,
  })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll({ includeCats: true });
  }

  @Get(':id') // GET '/user/:id'
  @SerializeOptions({ type: UserResponseDto })
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a user',
    type: UserResponseDto,
  })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Get(':id/cats') // Get 'user/:id/cats'
  @SerializeOptions({ type: CatResponseDto })
  @ApiOperation({ summary: 'Get cats by user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the cats of an user',
    type: CatResponseDto,
    isArray: true,
  })
  findCatsByUserId(@Param('id') id: string): Promise<CatResponseDto[]> {
    return this.catService.findAll({ userId: id });
  }

  @Patch(':id') // PATCH '/user/:id'
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @SerializeOptions({ type: UserResponseDto })
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user',
    type: UserResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestUserInformations,
  ): Promise<UserResponseDto> {
    if (req.user.userId !== id) {
      throw new UnauthorizedException(
        'You cannot update the information of a user other than yourself',
      );
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id') // DELETE '/user/:id'
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(
    @Param('id') id: string,
    @Request() req: RequestUserInformations,
  ): Promise<void> {
    if (req.user.userId !== id) {
      throw new UnauthorizedException(
        'You cannot delete the information of a user other than yourself',
      );
    }
    await this.userService.remove(id);
  }
}
