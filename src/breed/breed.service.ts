import { Injectable, NotFoundException } from '@nestjs/common';
import { BreedEntity } from './breed.entity';
import { CreateBreedDto } from './dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(BreedEntity)
    private breedRepository: Repository<BreedEntity>,
  ) {}

  async findAll(): Promise<BreedEntity[]> {
    return this.breedRepository.find();
  }

  async findOne(id: string): Promise<BreedEntity> {
    const breed = await this.breedRepository.findOneBy({ id });
    if (!breed) {
      throw new NotFoundException('Breed not found');
    }
    return breed;
  }

  async create(breed: CreateBreedDto): Promise<BreedEntity> {
    const newBreed = {
      name: breed.name,
      description: breed.description,
    };
    const createdBreed = await this.breedRepository.save(newBreed);
    return createdBreed;
  }
}
