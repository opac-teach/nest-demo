import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, ConflictException, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsEntity } from './comments.entity';
import { AuthGuard } from '@/lib/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post() // POST '/comment'
  @ApiOperation({ summary: 'Create a comment' })
  @ApiBody({type:CreateCommentsDto})
  @ApiResponse({ status: 201, description: 'Returns the created comments', type: CommentsEntity})
  async create(@Body() comment: CreateCommentsDto, @Request() req : any) {
      return this.commentsService.create(req.user.sub , comment);
  }

  @Get('/') // GET '/comments'
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Returns all comments' })
  findAll() {
    return this.commentsService.findAll();
  }
  
  @Get('/cat/:id') // GET '/comments/:id'
  @ApiOperation({ summary: 'Get a comments by cat id' })
  @ApiResponse({ status: 200, description: 'Returns comments' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findByCat(id);
  }

  
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // @Put(':id') // PUT '/users/:id'
  // @ApiOperation({ summary: 'Update a comment' })
  // @ApiResponse({ status: 200, description: 'Returns the updated commentf' })
  // async update(
  //   @Param('id') id: string,
  //   @Body() user: CreateCommentsDto,
  // ) {
  //   return this.commentsService.update(id, user);
  // }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

}
