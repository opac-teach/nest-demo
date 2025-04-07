import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CatService } from '@/cat/cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from '@/cat/dtos';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RequestWithUser } from '@/auth/guards/auth.guard';

@Controller('cat')
@UseGuards(AuthGuard)
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all cats' })
  @ApiResponse({ status: 200, description: 'Returns all cats' })
  findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll({ includeBreed: true });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cat by id' })
  @ApiResponse({ status: 200, description: 'Returns a cat' })
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id, true);
  }

  @Post()
  @ApiOperation({ summary: 'Create a cat' })
  @ApiResponse({ status: 201, description: 'Returns the created cat' })
  create(
    @Body() cat: CreateCatDto,
    @Req() req: RequestWithUser,
  ): Promise<CatResponseDto> {
    return this.catService.create(cat, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cat' })
  @ApiResponse({ status: 200, description: 'Returns the updated cat' })
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
    @Req() req: RequestWithUser,
  ): Promise<CatResponseDto> {
    return this.catService.update(id, cat, req.user.sub);
  }
}
