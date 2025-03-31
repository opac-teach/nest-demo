import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from '@/cat/dtos/cat-input.dto';
import { CatEntity } from '@/cat/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { generateColor } from '@/lib/colors';

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
    const { seed } = breed;
    const color = generateColor(seed);

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
}
