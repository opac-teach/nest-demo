import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from './dtos/cat-input.dto';
import { CatEntity } from './cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from 'src/breed/breed.service';
export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: string;
  includeBreed?: boolean;
}

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
    private readonly breedService: BreedService,
  ) {}

  async findAll(options?: CatFindAllOptions): Promise<CatEntity[]> {
    return this.catRepository.find({
      relations: options?.includeBreed ? ['breed'] : undefined,
      where: {
        breedId: options?.breedId,
      },
    });
  }

  async findOne(id: string, includeBreed?: boolean): Promise<CatEntity> {
    const cat = await this.catRepository.findOne({
      where: { id },
      relations: includeBreed ? ['breed'] : undefined,
    });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  async create(cat: CreateCatDto): Promise<CatEntity> {
    const breed = await this.breedService.findOne(cat.breedId);
    if (!breed) {
      throw new NotFoundException('Breed not found');
    }
    const { seed } = breed;
    const color = this.generateColor(seed);

    const newCat = this.catRepository.create({ ...cat, color });
    const createdCat = await this.catRepository.save(newCat);
    return createdCat;
  }

  async update(id: string, cat: UpdateCatDto): Promise<boolean> {
    const updatedCat = await this.catRepository.update(id, cat);
    if (updatedCat.affected === 0) {
      throw new NotFoundException('Cat not found');
    }
    return true;
  }

  private generateColor(seed: string): string {
    // Generate a color based on the breed's seed
    const hue = parseInt(seed.slice(0, 6), 36) % 360; // Convert seed to hue (0-360)
    const saturation = 70 + (parseInt(seed.slice(6, 8), 36) % 20); // 70-90%
    const lightness = 40 + (parseInt(seed.slice(8, 10), 36) % 20); // 40-60%

    // Convert HSL to RGB
    const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lightness / 100 - c / 2;
    let r, g, b;

    if (hue < 60) {
      [r, g, b] = [c, x, 0];
    } else if (hue < 120) {
      [r, g, b] = [x, c, 0];
    } else if (hue < 180) {
      [r, g, b] = [0, c, x];
    } else if (hue < 240) {
      [r, g, b] = [0, x, c];
    } else if (hue < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    const color = [
      Math.round((r + m) * 255)
        .toString(16)
        .padStart(2, '0'),
      Math.round((g + m) * 255)
        .toString(16)
        .padStart(2, '0'),
      Math.round((b + m) * 255)
        .toString(16)
        .padStart(2, '0'),
    ].join('');

    return color;
  }
}
