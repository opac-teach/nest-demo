import { Module } from '@nestjs/common';
import { ColorsModule } from './colors/colors.module';
import { StatsModule } from './stats/stats.module';
import { CatModule } from './cat/cat.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {databaseConfig} from "./config";

@Module({
  imports: [
      TypeOrmModule.forRoot(databaseConfig),
      ColorsModule,
      StatsModule,
      CatModule
  ],
})
export class AppModule {}
