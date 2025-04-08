import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CommentaireEntity } from './commentaire.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCommentaireDto, UpdateCommentaireDto } from './dtos';
import { RequestWithUser } from '@/auth/guards/auth.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';

@Controller('commentaire')
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}

  @Get()
  @ApiOperation({ summary: 'Get all commentaires' })
  @ApiResponse({ status: 200, description: 'Returns all commentaires' })
  findAll(): Promise<CommentaireEntity[]> {
    return this.commentaireService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a commentaire by id' })
  @ApiResponse({ status: 200, description: 'Returns a commentaire' })
  findOne(@Param('id') id: string): Promise<CommentaireEntity> {
    return this.commentaireService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a commentaire' })
  @ApiResponse({ status: 201, description: 'Returns the created commentaire' })
  create(
    @Body() commentaire: CreateCommentaireDto,
    @Req() req: RequestWithUser,
  ): Promise<CommentaireEntity> {
    return this.commentaireService.create(commentaire, req.user.sub);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a commentaire' })
  @ApiResponse({ status: 200, description: 'Returns the updated commentaire' })
  update(
    @Param('id') id: string,
    @Body() commentaire: UpdateCommentaireDto,
    @Req() req: RequestWithUser,
  ): Promise<CommentaireEntity> {
    return this.commentaireService.update(id, commentaire, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a commentaire' })
  @ApiResponse({ status: 200, description: 'Returns the deleted commentaire' })
  delete(@Param('id') id: string, @Req() req: RequestWithUser): Promise<void> {
    return this.commentaireService.delete(id, req.user.sub);
  }
}
