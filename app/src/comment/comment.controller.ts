import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment';
import { UpdateCommentDto } from './dtos/update-comment';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create a comment' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateCommentDto, @Request() req) {
    return this.commentService.create(dto, req.user.id);
  }

  @ApiOperation({ summary: 'Get a comment by catId' })
  @Get(':catId')
  findByCat(@Param('catId') catId: string) {
    return this.commentService.findByCat(catId);
  }

  @ApiOperation({ summary: 'Get all comments' })
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @ApiOperation({ summary: 'Patch a comment by Id' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentService.update(id, dto, req.user.id);
  }

  @ApiOperation({ summary: 'Get a comment by Id' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(id, req.user.id);
  }
}
