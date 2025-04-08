import { Injectable, NotFoundException } from '@nestjs/common';
import { BreedEntity } from './breed.entity';
import { CreateBreedDto } from './dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {CatEntity} from "@/cat/cat.entity";
@Injectable()
export class BreedService {
  constructor(
    @InjectRepository(BreedEntity)
    private breedRepository: Repository<BreedEntity>,
    private eventEmitter: EventEmitter2,
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
    const newBreed = this.breedRepository.create({
      name: breed.name,
      description: breed.description,
    });
    const createdBreed = await this.breedRepository.save(newBreed);
    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'breed',
      breed: createdBreed,
    });
    return createdBreed;
  }

  async findOrCreateHybrid(father: CatEntity, mother: CatEntity): Promise<BreedEntity> {
    const breedName = `${father.breed?.name}-${mother.breed?.name}`;
    let breed = await this.breedRepository.findOneBy({ name: breedName });
    if (!breed) {
      const seed = `${father.breed?.seed?.slice(0,5)}${mother.breed?.seed?.slice(0,5)}`;
      breed = this.breedRepository.create({
        name: breedName,
        seed,
      });
      breed = await this.breedRepository.save(breed);
    }
    return breed;
  }

}
