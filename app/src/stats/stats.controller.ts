import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get()
  @ApiOperation({ summary: 'Get last stats created' })
  @ApiResponse({ status: 200, description: 'Returns last stats created' })
  findLast() {
    return this.statsService.findLast();
  }

  @Get('range')
  async getStatsBetweenDates(
      @Query('minDate') minDate: string,
      @Query('maxDate') maxDate: string,
  ) {
    const min = new Date(minDate);
    const max = new Date(maxDate);
    return await this.statsService.findBetweenDates(min, max);
  }
}
