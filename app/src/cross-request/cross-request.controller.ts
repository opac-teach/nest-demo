import { Controller } from '@nestjs/common';
import { CrossRequestService } from './cross-request.service';

@Controller('cross-request')
export class CrossRequestController {
  constructor(private readonly crossRequestService: CrossRequestService) {}
}
