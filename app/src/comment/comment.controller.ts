import {Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request} from '@nestjs/common';
import { CommentService } from './comment.service';
import {CreateCommentDto, UpdateCommentDto} from "@/comment/dto/comment-input.dto";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {AuthGuard} from "@/auth/auth.guard";
import {CommentGuard} from "@/comment/comment.guard";
import {CommentResponseDto} from "@/comment/dto";

@Controller('comment')
export class CommentController {
  constructor(
      private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({ status: 201, description: 'Returns the created comment' })
  @UseGuards(AuthGuard)
  create(@Body() comment: CreateCommentDto, @Request() res): Promise<CommentResponseDto> {
    return this.commentService.create(comment, res.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Returns comments' })
  findAll(): Promise<CommentResponseDto[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comments by id' })
  @ApiResponse({ status: 200, description: 'Returns the comment' })
  findOne(@Param('id') id: string): Promise<CommentResponseDto> {
    return this.commentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Returns the updated comment' })
  @UseGuards(AuthGuard, CommentGuard)
  async update(@Param('id') id: string, @Body() comment: UpdateCommentDto): Promise<CommentResponseDto> {
    return await this.commentService.update(id, comment);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete a comment' })
  @ApiResponse({ status: 200, description: 'Returns the deleted comment' })
  @UseGuards(AuthGuard, CommentGuard)
  async remove(@Param('id') id: string): Promise<string> {
    return await this.commentService.remove(id);
  }
}
