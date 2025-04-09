import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { CommentService } from './comment.service';
  import { CreateCommentDto } from './dtos/create-comment';
  import { AuthGuard } from '@nestjs/passport';
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('comments')
  @ApiBearerAuth()
  @Controller('comments')
  export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() dto: CreateCommentDto, @Request() req) {
      return this.commentService.create(dto, req.user.id);
    }
  
    @Get(':catId')
    findByCat(@Param('catId') catId: string) {
      return this.commentService.findByCat(catId);
    }
  }
  