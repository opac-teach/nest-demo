import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from '@/cat/dtos/cat-input.dto';
import { CatEntity } from '@/cat/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: string;
  includeBreed?: boolean;
  includeUser?: boolean;
  includeCommentary?: boolean;
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
    const relations: string[] = [];
    if (options?.includeCommentary) {
      relations.push('commentaries');
    }
    if (options?.includeBreed) {
      relations.push('breed');
    }
    return this.catRepository.find({
      relations: relations.length ? relations : undefined,
      where: {
        breedId: options?.breedId,
      },
    });
  }

  async findOne(id: string, options?: CatFindAllOptions): Promise<CatEntity> {
    const relations: string[] = [];
    if (options?.includeCommentary) {
      relations.push('commentaries');
    }
    if (options?.includeBreed) {
      relations.push('breed');
    }
    const cat = await this.catRepository.findOne({
      relations:  relations.length ? relations : undefined,
      where: { id },
    });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  async findByOwner(ownerId: string, options?: CatFindAllOptions): Promise<CatEntity[]> {
    return this.catRepository.find({
      relations: options?.includeUser ? ['user'] : undefined,
      where: {
        userId: ownerId,
      },
    });
  }

  async create(id: string, cat: CreateCatDto): Promise<CatEntity> {
    const breed = await this.breedService.findOne(cat.breedId);
    const color = '11BB22';
    const newCat = this.catRepository.create({ ...cat, color, userId: id });
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
}
