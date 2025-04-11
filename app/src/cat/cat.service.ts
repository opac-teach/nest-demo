import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from '@/cat/dtos/cat-input.dto';
import { CatEntity } from '@/cat/entities/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { UsersService } from '@/users/users.service';
import { UsersEntity } from '@/users/entities/users.entity';
export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: number;
  includeBreed?: boolean;
}

@Injectable()
export class CatService {
  private userService: any;
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
    private readonly breedService: BreedService,
    private readonly eventEmitter: EventEmitter2,
    @Inject('COLORS_SERVICE') private client: ClientProxy,
    private  readonly usersService : UsersService
  ) {}

  async findAll(options?: CatFindAllOptions): Promise<CatEntity[]> {
    return this.catRepository.find({
      relations: options?.includeBreed ? ['breed'] : undefined,
      where: {
        breedId: options?.breedId,
      },
    });
  }

  async findOne(id: number, includeBreed?: boolean): Promise<CatEntity> {
    const cat = await this.catRepository.findOne({
      where: { id },
      relations: includeBreed ? ['breed'] : undefined,

    });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  async create(cat: CreateCatDto, userId: number): Promise<CatEntity> {
    // on récupère l'espèce du chat en vérifiant son existance
    const breed = await this.breedService.findOne(cat.breedId);
    if (!breed) {
      throw new NotFoundException('breed not exists');
    }

    // Idem pour le propriétaire
    const user = await this.usersService.findById(userId) as UsersEntity;
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const color = '11BB22';

    const newCat = this.catRepository.create({ ...cat, color, userId });

    const createdCat = await this.catRepository.save(newCat);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'cat',
      cat: createdCat,
    });

    return createdCat;
  }

  async update(id: number, cat: UpdateCatDto): Promise<CatEntity> {
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
