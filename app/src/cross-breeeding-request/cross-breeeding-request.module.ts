import { Module } from '@nestjs/common';
import { CrossBreeedingRequestService } from './cross-breeeding-request.service';
import { CrossBreeedingRequestController } from './cross-breeeding-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossBreedingRequestEntity } from '@/cross-breeeding-request/entity/crossBreedingRequest.entity';
import { CatModule } from '@/cat/cat.module';

@Module({
  controllers: [CrossBreeedingRequestController],
  imports: [TypeOrmModule.forFeature([CrossBreedingRequestEntity]), CatModule],
  providers: [CrossBreeedingRequestService],
})
export class CrossBreeedingRequestModule {}
