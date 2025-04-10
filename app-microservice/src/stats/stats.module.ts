import {forwardRef, Module} from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CatEntity} from "../cat/cat.entity";
import {CatModule} from "../cat/cat.module";
import {StatEntity} from "./stat.entity";

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [
      TypeOrmModule.forFeature([StatEntity, CatEntity]),
      forwardRef(() => CatModule)
  ],
  exports: [StatsService]
})
export class StatsModule {}
