import { Module, forwardRef } from '@nestjs/common';
import { BreedController } from './breed.controller';
import { BreedService } from './breed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedEntity } from './breed.entity';
import { CatEntity } from '@/cat/cat.entity';
import { CatModule } from '@/cat/cat.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@/auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([BreedEntity, CatEntity]),
    forwardRef(() => CatModule),
    forwardRef(() => AuthModule),
    JwtModule,
  ],
  controllers: [BreedController],
  providers: [BreedService],
  exports: [BreedService],
})
export class BreedModule {}
