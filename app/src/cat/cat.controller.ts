import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CatFindAllOptions, CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from '@/cat/dtos';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@/auth/jwt-auth.guard';

@Controller('cat') // route '/cat'
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/') // GET '/cat'
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({
    status: 200,
    description: 'Returns all cats',
    type: CatResponseDto,
  })
  @ApiQuery({ name: 'breedId', required: false, type: String })
  @ApiQuery({ name: 'includeBreed', required: false, type: Boolean })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'includeUser', required: false, type: Boolean })
  findAll(@Query() options: CatFindAllOptions): Promise<CatResponseDto[]> {
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(
    @Body() cat: CreateCatDto,
    @Req() req: { userId: string },
  ): Promise<CatResponseDto> {
    return this.catService.create(cat, req.userId);
  }

  @Put(':id') // PUT '/cat/:id'
  @ApiOperation({ summary: 'Update a cat' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Returns the updated cat' })
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat);
  }
}
