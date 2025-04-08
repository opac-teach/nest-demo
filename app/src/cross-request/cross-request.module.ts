import { forwardRef, Module } from '@nestjs/common';
import { CrossRequestService } from './cross-request.service';
import { CrossRequestController } from './cross-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossRequestEntity } from './cross-request.entity';
import { CatModule } from '@/cat/cat.module';
import { AuthModule } from '@/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CrossRequestController],
  providers: [CrossRequestService],
  imports: [
    TypeOrmModule.forFeature([CrossRequestEntity]),
    forwardRef(() => CatModule),
    forwardRef(() => AuthModule),
    JwtModule,
  ],
  exports: [CrossRequestService],
})
export class CrossRequestModule {}
