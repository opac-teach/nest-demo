import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto, UpdateUserDto } from './dtos';
import { CatResponseDto } from '@/cat/dtos';
import { CatService } from '@/cat/cat.service';
import { AuthGuard, RequestWithUser } from '@/auth/guards/auth.guard';
import { CommentaireResponseDto } from '@/commentaire/dtos';
import { CommentaireService } from '@/commentaire/commentaire.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly catService: CatService,
    private readonly commentaireService: CommentaireService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll({ includeCats: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Returns a user' })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id, { includeCats: true });
  }

  @Get(':id/cats')
  @ApiOperation({ summary: 'Get all cats by user id' })
  @ApiResponse({ status: 200, description: 'Returns all cats by user id' })
  findCats(@Param('id') id: string): Promise<CatResponseDto[]> {
    return this.catService.findAll({
      userId: id,
      includeUser: true,
    });
  }

  @Get(':id/commentaires')
  @ApiOperation({ summary: 'Get all commentaires by user id' })
  @ApiResponse({
    status: 200,
    description: 'Returns all commentaires by user id',
  })
  findCommentaires(@Param('id') id: string): Promise<CommentaireResponseDto[]> {
    return this.commentaireService.findAll({
      userId: id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'Returns the updated user' })
  update(
    @Req() req: RequestWithUser,
    @Body() user: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(req.user.sub, user);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'Returns the deleted user' })
  async remove(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.userService.remove(req.user.sub);
    res?.clearCookie('authToken');

    return { message: 'Votre compte a bien été supprimé.' };
  }
}
