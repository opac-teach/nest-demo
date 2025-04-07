import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put, Query,
  UseGuards,
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from '@/cat/dtos';
import { RandomGuard } from '@/lib/random.guard';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';

@Controller('cat') // route '/cat'
@UseGuards(RandomGuard)
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/') // GET '/cat'
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'Returns all cats' })
  @ApiQuery({
    name: 'ownerId',
    required: false,
    type: String,
    description: 'The id of the owner to filter cats by'
  })
  @ApiQuery({
    name: 'breedId',
    required: false,
    type: String,
    description: 'The id of the breed to filter cats by'
  })
  findAll(
      @Query('ownerId') ownerId?: string,
      @Query('breedId') breedId?: string,
      @Query('includeOwner') includeOwner: boolean = true,
      @Query('includeBreed') includeBreed: boolean = true
  ): Promise<CatResponseDto[]> {
    const options = {
      includeBreed,
      breedId,
      ownerId,
      includeOwner
    }
    return this.catService.findAll(options);
  }

  @Get(':id') // GET '/cat/:id'
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({ status: 200, description: 'Returns a cat' })
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id, true);
  }

  @Post() // POST '/cat'
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(@Body() cat: CreateCatDto): Promise<CatResponseDto> {
    return this.catService.create(cat);
  }

  @Put(':id') // PUT '/cat/:id'
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({ status: 200, description: 'Returns the updated cat' })
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat);
  }
}
