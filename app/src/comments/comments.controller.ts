import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@/auth/roles/roles.decorator';
import { RolesEnum } from '@/auth/roles/roles.enum';
import { RolesGuard } from '@/auth/roles/roles.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: { userId: string },
  ) {
    return this.commentsService.create(createCommentDto, req.userId);
  }

  @Get('by-cat/:catId')
  findAllByCatId(@Param('catId') catId: string) {
    return this.commentsService.findAllByCatId(catId);
  }

  @Get('by-user/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.commentsService.findAllByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: { userId: string },
  ) {
    return this.commentsService.update(id, updateCommentDto, req.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() req: { userId: string }) {
    return this.commentsService.remove(id, req.userId);
  }

  @Delete('mod/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Role(RolesEnum.ADMIN)
  @UseGuards(RolesGuard)
  removeCommentByMod(@Param('id') id: string) {
    return this.commentsService.removeCommentByMod(id);
  }
}
