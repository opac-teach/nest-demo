import { Injectable, NotFoundException } from '@nestjs/common';
import { BreedEntity } from './breed.entity';
import { CreateBreedDto } from './dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
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

  async createMixBreed(b1: BreedEntity, b2: BreedEntity): Promise<BreedEntity> {
    const name = `Mix : ${b1.name} x ${b2.name}`;
    const seed = `${b1.seed}-${b2.seed}`.slice(0, 32);
  
    const breed = this.breedRepository.create({ name, seed });
    return this.breedRepository.save(breed);
  }
  
}
