import { Controller } from '@nestjs/common';
import { StatsService } from './stats.service';
import {MessagePattern} from "@nestjs/microservices";

@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @MessagePattern('update_stats')
  async updateStats() {
    await this.statsService.create()
  }
}
