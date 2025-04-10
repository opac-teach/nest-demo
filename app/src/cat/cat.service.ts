import {Inject, Injectable, NotFoundException, Param, UnauthorizedException} from '@nestjs/common';
import {BreedCatsDto, CreateCatDto, UpdateCatDto, UpdatePositionCatDto} from '@/cat/dtos/cat-input.dto';
import { CatEntity } from '@/cat/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {plainToInstance} from "class-transformer";
export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: string;
  includeBreed?: boolean;
  ownerId?: string;
  includeOwner?: boolean
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
    const where: any = {}
    if (options?.breedId) {
      where.breedId = options.breedId
    }
    if (options?.ownerId !== undefined) {
      where.ownerId = options.ownerId
    }

    return this.catRepository.find({
      relations: [
        ...(options?.includeBreed ? ['breed'] : []),
        ...(options?.includeOwner ? ['owner'] : [])
      ],
      where: where,
    })
  }

  async findAllCatPosition(): Promise<CatEntity[]> {
    return await this.catRepository.find();
  }

  async findOne(id: string, includeBreed?: boolean): Promise<CatEntity> {
    const cat = await this.catRepository.findOne({
      where: { id },
      relations: [
        ...(includeBreed ? ['breed'] : []),
        'owner',
        'comments'
      ],
    });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  async create(cat: CreateCatDto, ownerId: String): Promise<CatEntity> {
    const breed = await this.breedService.findOne(cat.breedId);

    // const { seed } = breed;
    // const colorObservable = this.client.send<string, string>('generate_color', seed);
    // const color = await firstValueFrom(colorObservable);

    const color = '11BB22';
    const newCat = this.catRepository.create({ ...cat, color, ownerId });
    const createdCat = await this.catRepository.save(newCat);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'cat',
      cat: createdCat,
    });

    return createdCat;
  }

  async update(id: string, cat: UpdateCatDto): Promise<CatEntity> {
    const updateResponse = await this.catRepository.update(id, cat);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('Cat not found');
    }
    const updatedCat = await this.findOne(id);
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'cat',
      cat: updatedCat,
    });
    return updatedCat;
  }

  async breed(data: BreedCatsDto, userId: string): Promise<CatEntity> {
    const { fatherId, motherId, name } = data
    const [father, mother] = await this.catRepository.find({
      where: [{ id: fatherId }, { id: motherId }],
      relations: ['breed'],
    });

    if (!father || !mother) {
      throw new NotFoundException('Cats not found.');
    }
    if (father.ownerId !== userId || mother.ownerId !== userId) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }

    let breed;
    if (father.breedId === mother.breedId) {
      breed = father?.breed;
    } else {
      breed = await this.breedService.findOrCreateHybrid(
          father,
          mother
      );
    }
    const breedId = breed.id

    const catDto = plainToInstance(CreateCatDto, {
      name,
      age: 0,
      breedId,
    })
    return await this.create(catDto, userId)
  }

  async updatePosition(id: String, cat: UpdatePositionCatDto) {
    const updateResponse = await this.catRepository.update(id, cat)
    if (updateResponse.affected === 0) {
      throw new NotFoundException('Cat not found');
    }
    const updatedCat = await this.findOne(id);
    this.eventEmitter.emit('cat.position', {
      action: 'update position',
      model: 'cat',
      cat: updatedCat,
    });
    return updatedCat;
  }
}
