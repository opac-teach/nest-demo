import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from '@/cat/dtos/cat-input.dto';
import { BreedCatsDto } from '@/cat/dtos';
import { CatEntity } from '@/cat/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: string;
  ownerId?: number;
  includeBreed?: boolean;
}

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
    private readonly breedService: BreedService,
    private readonly eventEmitter: EventEmitter2,
    @Inject('COLORS_SERVICE') private client: ClientProxy,
  ) {}

  async findAll(options?: CatFindAllOptions): Promise<CatEntity[]> {
    const where: any = {};
  
    if (options?.breedId) {
      where.breedId = options.breedId;
    }
    if (options?.ownerId) {
      where.ownerId = options.ownerId;
    }
  
    return this.catRepository.find({
      where,
      relations: options?.includeBreed ? ['breed'] : undefined,
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

  async create(cat: CreateCatDto, ownerId: number): Promise<CatEntity> {
    const breed = await this.breedService.findOne(cat.breedId);
  
    // const { seed } = breed;
    // const colorObservable = this.client.send<string, string>('generate_color', seed);
    // const color = await firstValueFrom(colorObservable);
  
    const color = '11BB22';
    const newCat = this.catRepository.create({
      ...cat,
      color,
      ownerId,
    });
  
    const createdCat = await this.catRepository.save(newCat);
    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'cat',
      cat: createdCat,
    });
  
    return createdCat;
  }

  async update(id: string, cat: UpdateCatDto, userId: number): Promise<CatEntity> {
    const existingCat = await this.catRepository.findOne({ where: { id } });
  
    if (!existingCat) {
      throw new NotFoundException('Cat not found');
    }
    if (existingCat.ownerId !== userId) {
      throw new NotFoundException('You are not authorized to update this cat');
    }
  
    await this.catRepository.update(id, cat);
    const updatedCat = await this.findOne(id);
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'cat',
      cat: updatedCat,
    });
  
    return updatedCat;
  }

  async delete(id: string, userId: number): Promise<void> {
    const cat = await this.catRepository.findOne({ where: { id } });
  
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    if (cat.ownerId !== userId) {
      throw new NotFoundException('You are not authorized to delete this cat');
    }
  
    await this.catRepository.delete(id);
    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'cat',
      catId: id,
    });
  }  

  async breedCats(dto: BreedCatsDto, userId: number): Promise<CatEntity> {
    const { catId1, catId2 } = dto;
  
    const cat1 = await this.catRepository.findOne({ where: { id: catId1 }, relations: ['breed'] });
    const cat2 = await this.catRepository.findOne({ where: { id: catId2 }, relations: ['breed'] });

  
    if (!cat1 || !cat2) {
      throw new NotFoundException("Un ou deux chats non trouvés.");
    }
    if (cat1.ownerId !== userId || cat2.ownerId !== userId) {
      throw new NotFoundException("Vous ne possédez pas ces chats.");
    }
    let resultingBreed = cat1.breed;
    
    if (!cat1.breed || !cat2.breed) {
      throw new NotFoundException("Les races des chats n'ont pas été trouvées");
    }
    if (cat1.breedId !== cat2.breedId) {
      resultingBreed = await this.breedService.createMixBreed(cat1.breed, cat2.breed);
    }
  
    const color = '77AA33'; // Pour prendre en compte la couleur implémentée de base dans le projet initial.
    const kitten = this.catRepository.create({
      name: dto.name ?? `Chaton de ${cat1.name} & ${cat2.name}`,
      color,
      ownerId: userId,
      breed: resultingBreed,
      age: 0,
    });
  
    const savedKitten = await this.catRepository.save(kitten);
    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'cat',
      cat: savedKitten,
    });
  
    return savedKitten;
  }
  
}
