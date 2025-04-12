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
  SerializeOptions,
} from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CommentaireResponseDto,
  CreateCommentaireDto,
  UpdateCommentaireDto,
} from './dtos';
import { RequestWithUser } from '@/auth/guards/auth.guard';
import { AuthGuard } from '@/auth/guards/auth.guard';

@Controller('commentaire')
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}

  @Get()
  @ApiOperation({ summary: 'Get all commentaires' })
  @ApiResponse({ status: 200, description: 'Returns all commentaires' })
  @SerializeOptions({ type: CommentaireResponseDto })
  findAll(): Promise<CommentaireResponseDto[]> {
    return this.commentaireService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a commentaire by id' })
  @ApiResponse({ status: 200, description: 'Returns a commentaire' })
  @SerializeOptions({ type: CommentaireResponseDto })
  findOne(@Param('id') id: string): Promise<CommentaireResponseDto> {
    return this.commentaireService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a commentaire' })
  @ApiResponse({ status: 201, description: 'Returns the created commentaire' })
  @SerializeOptions({ type: CommentaireResponseDto })
  create(
    @Body() commentaire: CreateCommentaireDto,
    @Req() req: RequestWithUser,
  ): Promise<CommentaireResponseDto> {
    return this.commentaireService.create(commentaire, req.user.sub);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a commentaire' })
  @ApiResponse({ status: 200, description: 'Returns the updated commentaire' })
  @SerializeOptions({ type: CommentaireResponseDto })
  async update(
    @Param('id') id: string,
    @Body() commentaire: UpdateCommentaireDto,
    @Req() req: RequestWithUser,
  ): Promise<CommentaireResponseDto> {
    return await this.commentaireService.update(id, commentaire, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a commentaire' })
  @ApiResponse({ status: 200, description: 'Returns the deleted commentaire' })
  async delete(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    await this.commentaireService.delete(id, req.user.sub);
    return { message: 'Commentaire supprimé avec succès' };
  }
}
