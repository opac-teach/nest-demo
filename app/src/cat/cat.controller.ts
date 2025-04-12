import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    SerializeOptions,
    UseGuards,
    Request, Inject, Patch, Query
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import {
  BreedCatsDto,
  CatPositionResponseDto,
  CatResponseDto,
  CreateCatDto,
  UpdateCatDto,
  UpdatePositionCatDto
} from '@/cat/dtos';
import { RandomGuard } from '@/lib/random.guard';
import {ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {AuthGuard} from "@/auth/auth.guard";
import {OwnerGuard} from "@/cat/cat.guard";
import {CatEntity} from "@/cat/cat.entity";

@Controller('cat') // route '/cat'
@UseGuards(RandomGuard)
export class CatController {
  constructor(
      private catService: CatService
  ) {}

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
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  @UseGuards(AuthGuard)
  create(@Body() cat: CreateCatDto, @Request() req): Promise<CatResponseDto> {
    return this.catService.create(cat, req.user.sub);
  }

  @Put(':id') // PUT '/cat/:id'
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({ status: 200, description: 'Returns the updated cat' })
  @UseGuards(AuthGuard, OwnerGuard)
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat);
  }

  @UseGuards(AuthGuard)
  @Post('/breed')
  @ApiOperation({ summary: 'Breeding two cats from the same owner' })
  @ApiResponse({ status: 201, description: 'Returns created cat' })
  breedCats(@Body() data: BreedCatsDto, @Request() req): Promise<CatResponseDto> {
    return this.catService.breed(data, req.user.sub);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({ status: 200, description: 'Returns the updated position cat' })
  @UseGuards(AuthGuard, OwnerGuard)
  async changePosition(
      @Param('id') id: string,
      @Body() cat: UpdatePositionCatDto,
  ): Promise<CatResponseDto> {
    return this.catService.updatePosition(id, cat);
  }

  @Get('/position')
  @ApiOperation({ summary: 'Get all cats position' })
  @ApiResponse({ status: 200, description: 'Returns all cats position' })
  findAllPositionCat(
  ): Promise<CatEntity[]> {
    return this.catService.findAllCatPosition();
  }
}
