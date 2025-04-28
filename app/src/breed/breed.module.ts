import { Module, forwardRef } from '@nestjs/common';
import { BreedController } from './breed.controller';
import { BreedService } from './breed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedEntity } from './breed.entity';
import { CatEntity } from '@/cat/cat.entity';
import { CatModule } from '@/cat/cat.module';
import { BreedResolver } from './breed.resolver';
@Module({
  imports: [
    TypeOrmModule.forFeature([BreedEntity, CatEntity]),
    forwardRef(() => CatModule),
  ],
  controllers: [BreedController],
  providers: [BreedService, BreedResolver],
  exports: [BreedService],
})
export class BreedModule {}
