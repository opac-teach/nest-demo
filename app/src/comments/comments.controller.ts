import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comments.service';
import { AuthGuard } from '@/auth/auth.guard';
import { CreateCommentDto } from './dtos/comment-input.dto';
import { UpdateCommentDto } from './dtos/comment-update.dto';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':catId')
  create(
    @Param('catId') catId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentService.create(createCommentDto, req.user, catId);
  }

  @Get(':catId')
  findAllByCat(@Param('catId') catId: string) {
    return this.commentService.findAllByCat(catId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentService.update(id, updateCommentDto, req.user.sub);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.commentService.delete(id, req.user.sub);
  }
}