import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto, BreedCatsDto } from '@/cat/dtos';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('cat') // route '/cat'
// @UseGuards(RandomGuard)
@Controller('cat')
@ApiTags('cat')
@ApiBearerAuth() 
export class CatController {
  constructor(private catService: CatService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Get('/')
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'Returns all cats' })
  @ApiQuery({
    name: 'ownerId',
    required: false,
    type: Number,
    description: 'Filter cats by owner ID',
  })
  findAll(@Query('ownerId') ownerId?: number): Promise<CatResponseDto[]> {
    return this.catService.findAll({
      includeBreed: true,
      ownerId: ownerId ? Number(ownerId) : undefined,
    });
  }

  @Get(':id')
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(
    @Body() cat: CreateCatDto,
    @Request() req, 
  ): Promise<CatResponseDto> {
    return this.catService.create(cat, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({ status: 200, description: 'Returns the updated cat' })
  update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
    @Request() req,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a cat' })
  @ApiResponse({ status: 200, description: 'Deletes a cat' })
  delete(@Param('id') id: string, @Request() req): Promise<void> {
    return this.catService.delete(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('breed')
  @ApiOperation({ summary: 'Breed two cats' })
  @ApiResponse({ status: 201, description: 'Crée un chaton à partir de deux autres chats. Le nom du chaton étant optionnel.' })
  breed(
    @Body() dto: BreedCatsDto,
    @Request() req
  ): Promise<CatResponseDto> {
    return this.catService.breedCats(dto, req.user.id);
  }

}
