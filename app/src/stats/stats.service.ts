import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Between, Repository} from "typeorm";
import {StatEntity} from "@/stats/stat.entity";

@Injectable()
export class StatsService {
  constructor(
      @InjectRepository(StatEntity)
      private readonly statsRepository: Repository<StatEntity>
  ) {}
  async findLast(): Promise<StatEntity | null> {
    return await this.statsRepository.findOne({
      order: { created: 'DESC' },
    });
  }

  async findBetweenDates(minDate: Date, maxDate: Date): Promise<StatEntity[]> {
    return await this.statsRepository.find({
      where: {
        created: Between(minDate, maxDate),
      },
    });
  }
}
