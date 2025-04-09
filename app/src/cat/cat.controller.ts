import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  SerializeOptions
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from '@/cat/dtos';
import { RandomGuard } from '@/lib/random.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('cat') // route '/cat'

export class CatController {
  constructor(private catService: CatService) {}

  @Get('/') // GET '/cat'
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({
    status: 200,
    description: 'Returns all cats',
    type: CatResponseDto,
    isArray: true,
  })
  @SerializeOptions({ type: CatResponseDto })
  async findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll({ includeBreed: true });
  }

  @Get(':id') // GET '/cat/:id'
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a cat',
    type: CatResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<CatResponseDto> {
    const cat = await this.catService.findOne(id, true);
    return new CatResponseDto(cat);
  }

  @Post() // POST '/cat'
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created cat',
    type: CatResponseDto,
  })
  @SerializeOptions({ type: CatResponseDto })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(@Body() cat: CreateCatDto, @Request() req): Promise<CatResponseDto> {
    return this.catService.create(cat, req.user.userId);
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
