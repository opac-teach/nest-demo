import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';
import { AuthGuard } from '@/auth/auth.guard';

import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add one Commentaries' })
  @ApiResponse({ status: 200, description: 'Add one Commentaries' })
  create(@Body() createCommentaryDto: CreateCommentaryDto, @Request() req: any) {
    return this.commentaryService.create(req, createCommentaryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Commentaries' })
  @ApiResponse({ status: 200, description: 'Returns all Commentaries' })
  findAll() {
    return this.commentaryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one Commentaries' })
  @ApiResponse({ status: 200, description: 'Returns one Commentaries' })
  findOne(@Param('id') id: string) {
    return this.commentaryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the selected Commentaries' })
  @ApiResponse({ status: 200, description: 'Update the selected Commentaries' })
  update(@Param('id') id: string, @Body() updateCommentaryDto: UpdateCommentaryDto, @Request() req: any) {
    return this.commentaryService.update(id, req, updateCommentaryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete the selected Commentaries' })
  @ApiResponse({ status: 200, description: 'Delete the selected Commentaries' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.commentaryService.remove(id, req);
  }
}
