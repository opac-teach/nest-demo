import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatResponseDto, CatsResponseDto } from './dtos/cats-response.dto';
import { CreateCatDto, UpdateCatDto } from './dtos/cats-input.dto';
import { RandomGuard } from './random.guard';

@Controller('cats')
@UseGuards(RandomGuard)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get('/')
  findAll(): CatsResponseDto {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): CatResponseDto {
    return this.catsService.findOne(id);
  }

  @Post()
  create(@Body() cat: CreateCatDto): CatResponseDto {
    return this.catsService.create(cat);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() cat: UpdateCatDto): CatResponseDto {
    return this.catsService.update(id, cat);
  }
}
