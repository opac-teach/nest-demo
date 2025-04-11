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
import { RandomGuard } from '@/lib/random.guard';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard} from "@/auth/auth.guard";

@Controller('cat') // route '/cat'
// @UseGuards(RandomGuard)
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
  }
  )
  @SerializeOptions({type: CatResponseDto})
  findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll({ includeBreed: true });
  }

  @Get(':id') // GET '/cat/:id'
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({ status: 200, description: 'Returns a cat' })
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id, true);
  }

  @ApiBearerAuth()
  @Post() // POST '/cat'
  @UseGuards(AuthGuard)
  @SerializeOptions({ type: CatResponseDto })
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(
    @Body() cat: CreateCatDto,
    @Request() req
    ): Promise<CatResponseDto> {
    const userId = req.user?.sub;
    return this.catService.create(cat, userId);
  }

  @Put(':id') // PUT '/cat/:id'
  @UseGuards(AuthGuard)
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
