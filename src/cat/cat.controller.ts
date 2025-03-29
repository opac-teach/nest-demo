import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CatService } from './cat.service';
import { CatResponseDto, CreateCatDto, UpdateCatDto } from './dtos';
import { RandomGuard } from './random.guard';

@Controller('cat')
@UseGuards(RandomGuard)
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/')
  findAll(): Promise<CatResponseDto[]> {
    return this.catService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CatResponseDto> {
    return this.catService.findOne(id);
  }

  @Post()
  create(@Body() cat: CreateCatDto): Promise<CatResponseDto> {
    return this.catService.create(cat);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() cat: UpdateCatDto,
  ): Promise<CatResponseDto> {
    await this.catService.update(id, cat);
    return this.catService.findOne(id);
  }
}
