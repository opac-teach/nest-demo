import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put, Req,
  UseGuards,
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from '@/cat/dtos';
//import { RandomGuard } from '@/lib/random.guard';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UserResponseDto } from "@/user/dto/user-response";


@Controller('cat') // route '/cat'
//@UseGuards(RandomGuard)
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/') // GET '/cat'
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'Returns all cats' })
  findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll({ includeBreed: true });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id') // GET '/cat/:id'
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({ status: 200, description: 'Returns a cat' })
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id, true);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post() // POST '/cat'
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(@Body() cat: CreateCatDto, @Req() req): Promise<CatResponseDto> {
    return this.catService.create(cat, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
