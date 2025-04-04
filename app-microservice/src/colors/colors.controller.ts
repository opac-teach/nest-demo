import { Controller } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @MessagePattern('generate_color')
  generateColor(breedSeed: string): string {
    return this.colorsService.getColors(breedSeed);
  }
}
