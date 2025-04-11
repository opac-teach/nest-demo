import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment on a cat' })
  @ApiResponse({ status: 201, description: 'The comment has been created' })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    if (!req.user) {
      throw new ForbiddenException('User must be authenticated to create a comment');
    }
    return this.commentService.create(createCommentDto, req.user);
  }

  @Get('cat/:catId')
  @ApiOperation({ summary: 'Get all comments for a specific cat' })
  @ApiResponse({ status: 200, description: 'Returns all comments linked to a cat' })
  findByCat(@Param('catId') catId: string) {
    return this.commentService.findByCat(catId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by its ID' })
  @ApiResponse({ status: 200, description: 'Returns the comment' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated' })
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Req() req) {
    const comment = await this.commentService.findOne(id);
    if (comment.author.id !== req.user.id) {
      throw new ForbiddenException("You can only edit your own comment");
    }
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
  async remove(@Param('id') id: string, @Req() req) {
    const comment = await this.commentService.findOne(id);
    if (comment.author.id !== req.user.id) {
      throw new ForbiddenException("You can only delete your own comment");
    }
    return this.commentService.remove(id);
  }
}