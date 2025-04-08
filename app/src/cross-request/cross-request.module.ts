import { Module } from '@nestjs/common';
import { CrossRequestService } from './cross-request.service';
import { CrossRequestController } from './cross-request.controller';

@Module({
  controllers: [CrossRequestController],
  providers: [CrossRequestService],
})
export class CrossRequestModule {}
