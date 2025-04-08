import { Controller } from '@nestjs/common';
import { CrossBreedingService } from './cross-breeding.service';

@Controller('cross-breeding')
export class CrossBreedingController {
  constructor(private readonly crossBreedingService: CrossBreedingService) {}
}
