import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment-input.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentResponseDto } from './dto/comment-response.dto';
import { AuthGuard } from '@nestjs/passport';
import RequestUserInformations from '@/interfaces/request-user-informations.interface';
import { CommentEntity } from './entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get() // GET '/comment'
  @SerializeOptions({ type: CommentResponseDto })
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'Returns all comments',
    type: CommentResponseDto,
    isArray: true,
  })
  findAll(): Promise<CommentEntity[]> {
    return this.commentService.findAll({ includeCat: true, includeUser: true });
  }

  @Get(':id') // GET '/comment/:id'
  @SerializeOptions({ type: CommentResponseDto })
  @ApiOperation({ summary: 'Get a comment by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a comment',
    type: CommentResponseDto,
  })
  findOne(@Param('id') id: string): Promise<CommentEntity> {
    return this.commentService.findOne(id, {
      includeCat: true,
      includeUser: true,
    });
  }

  @Post() // POST '/comment'
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @SerializeOptions({ type: CommentResponseDto })
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created comment',
    type: CommentResponseDto,
  })
  create(
    @Request() req: RequestUserInformations,
    @Body() comment: CreateCommentDto,
  ): Promise<CommentEntity> {
    const newComment = {
      userId: req.user.userId,
      ...comment,
    };
    return this.commentService.create(newComment);
  }

  @Patch(':id') // PATCH '/comment/:id'
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @SerializeOptions({ type: CommentResponseDto })
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated comment',
    type: CommentResponseDto,
  })
  async update(
    @Request() req: RequestUserInformations,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.update(id, req.user.userId, updateCommentDto);
  }

  @Delete(':id') // DELETE '/comment/:id'
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(
    @Request() req: RequestUserInformations,
    @Param('id') id: string,
  ): Promise<void> {
    return this.commentService.remove(id, req.user.userId);
  }
}
