import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  SerializeOptions,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from '@/cat/dtos';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('cat') // route '/cat'
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/') // GET '/cat'
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'Returns all cats' })
  findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll({ includeBreed: true, includeCommentary: true });
  }

  @Get(':id') // GET '/cat/:id'
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({ status: 200, description: 'Returns a cat' })
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id, { includeBreed: true, includeCommentary: true });
  }

  @Get('/owner/:ownerId')
  @ApiOperation({ summary: 'Get cats by owner' })
  @ApiResponse({ status: 200, description: 'Returns cats filtered by owner with their infos' })
  findByOwner(@Param('ownerId') ownerId: string): Promise<CatResponseDto[]> {
    return this.catService.findByOwner(ownerId, { includeUser: true });
  }

  @Post() // POST '/cat'
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(@Body() cat: CreateCatDto, @Request() req): Promise<CatResponseDto> {
    return this.catService.create(req.user.id, cat);
  }

  @Put(':id') // PUT '/cat/:id'
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({ status: 200, description: 'Returns the updated cat' })
  @SerializeOptions({ type: CatResponseDto })
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat);
  }
}