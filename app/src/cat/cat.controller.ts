import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  SerializeOptions,
  Delete,
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import {
  CatResponseDto,
  CreateCatDto,
  CreateKittenDto,
  UpdateCatDto,
} from '@/cat/dtos';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RequestWithUser } from '@/auth/guards/auth.guard';
import { CommentaireResponseDto } from '@/commentaire/dtos';
import { CommentaireService } from '@/commentaire/commentaire.service';

@Controller('cat')
@UseGuards(AuthGuard)
export class CatController {
  constructor(
    private readonly catService: CatService,
    private readonly commentaireService: CommentaireService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'Returns all cats' })
  @SerializeOptions({ type: CatResponseDto })
  findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll({
      includeBreed: true,
      includeCommentaires: true,
      includeUser: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({ status: 200, description: 'Returns a cat' })
  @SerializeOptions({ type: CatResponseDto })
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id, {
      includeCommentaires: true,
      includeBreed: true,
      includeUser: true,
    });
  }

  @Get(':id/commentaires')
  @ApiOperation({ summary: 'Get all commentaires by cat id' })
  @ApiResponse({
    status: 200,
    description: 'Returns all commentaires by cat id',
  })
  @SerializeOptions({ type: CommentaireResponseDto })
  findCommentaires(@Param('id') id: string): Promise<CommentaireResponseDto[]> {
    return this.commentaireService.findAll({ catId: id, includeCat: true });
  }

  @Post()
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  @SerializeOptions({ type: CatResponseDto })
  create(
    @Body() cat: CreateCatDto,
    @Req() req: RequestWithUser,
  ): Promise<CatResponseDto> {
    return this.catService.create(cat, req.user.sub);
  }

  @Post('kitten')
  @ApiOperation({ summary: 'Create a kitten' })
  @ApiResponse({ status: 201, description: 'Returns the created kitten' })
  @SerializeOptions({ type: CatResponseDto })
  createKitten(
    @Body() kitten: CreateKittenDto,
    @Req() req: RequestWithUser,
  ): Promise<CatResponseDto> {
    return this.catService.createKitten(kitten, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({ status: 200, description: 'Returns the updated cat' })
  @SerializeOptions({ type: CatResponseDto })
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
    @Req() req: RequestWithUser,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiResponse({ status: 200, description: 'Returns the deleted cat' })
  @SerializeOptions({ type: CatResponseDto })
  async delete(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    await this.catService.delete(id, req.user.sub);
    return { message: 'Chat supprimé avec succès' };
  }
}
