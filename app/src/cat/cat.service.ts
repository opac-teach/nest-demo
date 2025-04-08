import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { CrossRequestService } from '@/cross-request/cross-request.service';
import { CrossRequestStatus } from '@/cross-request/cross-request.entity';
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
    private readonly crossRequestService: CrossRequestService,
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
    const color = '11BB22';

    const newCat = this.catRepository.create({
      ...cat,
      color,
      userId,
    });
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

    let isSameOwner: boolean = true;

    for (const cat of catParents) {
      if (cat.userId !== userId) {
        isSameOwner = false;
      }
    }

    // Si les deux chats n'ont pas le même créateur, on vérifie qu'une cross-request en statut ACCEPTED existe entre les deux parents
    if (!isSameOwner) {
      const crossRequest = await this.crossRequestService.findOneCrossRequest({
        catId1: parent1.id,
        catId2: parent2.id,
        status: CrossRequestStatus.ACCEPTED,
      });

      // On supprime la cross-request une fois qu'on l'a utilisée, cela permet de créer seulement une fois le chaton
      await this.crossRequestService.delete(crossRequest.id);
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
    const updateResponse = await this.catRepository.update({ id, userId }, cat);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('Chat non trouvé');
    }
    const updatedCat = await this.findOne(id);
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'cat',
      cat: updatedCat,
    });
    return updatedCat;
  }

  async delete(id: string, userId: string): Promise<void> {
    const deleteResponse = await this.catRepository.delete({ id, userId });
    if (deleteResponse.affected === 0) {
      throw new NotFoundException('Chat non trouvé');
    }
  }

  // async createCrossKitten(): Promise<CatEntity> {}
}
