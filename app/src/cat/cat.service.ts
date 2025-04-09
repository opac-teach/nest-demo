import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from '@/cat/dtos/cat-input.dto';
import { CatEntity } from '@/cat/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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

}
