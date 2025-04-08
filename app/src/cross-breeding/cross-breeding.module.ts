import { Module } from '@nestjs/common';
import { CrossBreedingService } from './cross-breeding.service';
import { CrossBreedingController } from './cross-breeding.controller';

@Module({
  controllers: [CrossBreedingController],
  providers: [CrossBreedingService],
})
export class CrossBreedingModule {}
