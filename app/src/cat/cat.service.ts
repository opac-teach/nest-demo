import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateCatDto,
  CreateKittenDto,
  UpdateCatDto,
} from '@/cat/dtos/cat-input.dto';
import { CatEntity } from '@/cat/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { ClientProxy } from '@nestjs/microservices';

export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: string;
  userId?: string;
  includeBreed?: boolean;
  includeUser?: boolean;
  includeCommentaires?: boolean;
}

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
    private readonly breedService: BreedService,
    private readonly eventEmitter: EventEmitter2,
    // @Inject('COLORS_SERVICE') private client: ClientProxy,
  ) {}

  async findAll(options?: CatFindAllOptions): Promise<CatEntity[]> {
    const cats = await this.catRepository.find({
      relations: {
        breed: options?.includeBreed,
        user: options?.includeUser,
        commentaires: options?.includeCommentaires,
      },
      where: {
        breedId: options?.breedId,
        userId: options?.userId,
      },
    });

    return cats;
  }

  async findOne(id: string, options?: CatFindAllOptions): Promise<CatEntity> {
    const cat = await this.catRepository.findOne({
      where: { id },
      relations: {
        breed: options?.includeBreed,
        user: options?.includeUser,
        commentaires: options?.includeCommentaires,
      },
    });
    if (!cat) {
      throw new NotFoundException('Cat not found');
    }
    return cat;
  }

  async create(cat: CreateCatDto, userId: string): Promise<CatEntity> {
    if (!userId) {
      throw new UnauthorizedException("ID d'utilisateur manquant");
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

  async createKitten(
    kitten: CreateKittenDto,
    userId: string,
  ): Promise<CatEntity> {
    if (kitten.parent1Id === kitten.parent2Id) {
      throw new BadRequestException(
        'Les parents ne peuvent pas être identiques',
      );
    }

    const parent1 = await this.findOne(kitten.parent1Id);
    const parent2 = await this.findOne(kitten.parent2Id);

    const catParents = [parent1, parent2];

    for (const cat of catParents) {
      if (cat.userId !== userId) {
        throw new UnauthorizedException(
          `Le chaton ${cat.name} ne vous appartient pas`,
        );
      }
    }

    let breedSeedId: string;
    if (parent1.breedId === parent2.breedId) {
      breedSeedId = parent1.breedId;
    } else {
      const breed = await this.breedService.findAll();
      breedSeedId = breed[Math.floor(Math.random() * breed.length)].id;
    }

    const newKitten = this.catRepository.create({
      name: kitten.name,
      age: 1,
      color: '11BB22',
      breedId: breedSeedId,
      userId,
    });

    return await this.catRepository.save(newKitten);
  }

  async update(
    id: string,
    cat: UpdateCatDto,
    userId: string,
  ): Promise<CatEntity> {
    const catToUpdate = await this.findOne(id);
    if (catToUpdate.userId !== userId) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à modifier ce chat",
      );
    }
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
