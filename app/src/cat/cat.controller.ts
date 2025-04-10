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
//import { RandomGuard } from '@/lib/random.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import RequestUserInformations from '@/interfaces/request-user-informations.interface';

@ApiBearerAuth()
@Controller('cat') // route '/cat'
//@UseGuards(RandomGuard)
@UseGuards(AuthGuard('jwt'))
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/') // GET '/cat'
  @SerializeOptions({ type: CatResponseDto })
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({
    status: 200,
    description: 'Returns all cats',
    type: CatResponseDto,
    isArray: true,
  })
  findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll({ includeBreed: true, includeUser: true });
  }

  @Get(':id') // GET '/cat/:id'
  @SerializeOptions({ type: CatResponseDto })
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns a cat',
    type: CatResponseDto,
  })
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id, {
      includeBreed: true,
      includeUser: true,
    });
  }

  @Post() // POST '/cat'
  @SerializeOptions({ type: CatResponseDto })
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created cat',
    type: CatResponseDto,
  })
  create(
    @Request() req: RequestUserInformations,
    @Body() cat: CreateCatDto,
  ): Promise<CatResponseDto> {
    const newCat = {
      userId: req.user.userId,
      ...cat,
    };
    return this.catService.create(newCat);
  }

  @Put(':id') // PUT '/cat/:id'
  @SerializeOptions({ type: CatResponseDto })
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated cat',
    type: CatResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat);
  }
}
