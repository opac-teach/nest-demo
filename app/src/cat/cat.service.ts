import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto } from '@/cat/dtos/cat-input.dto';
import { CatEntity } from '@/cat/cat.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BreedService } from '@/breed/breed.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { UsersService } from '@/users/users.service';
import { firstValueFrom } from 'rxjs';
export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: string;
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
    private readonly usersService: UsersService
  ) {}

  async findAll(options?: CatFindAllOptions): Promise<CatEntity[]> {
    return this.catRepository.find({
      relations: options?.includeBreed ? ['breed'] : undefined,
      where: {
        breedId: options?.breedId,
      },
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

  async create(cat: CreateCatDto, user: any): Promise<CatEntity> {
    const breed = await this.breedService.findOne(cat.breedId);

    // const { seed } = breed;
    // const colorObservable = this.client.send<string, string>('generate_color', seed);
    // const color = await firstValueFrom(colorObservable);

    const color = '11BB22';
    
    const userId = user.UserId; 
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newCat = this.catRepository.create({
      name: cat.name,
      age: cat.age,
      breedId: cat.breedId,
      userId,  
      color,
    });
    
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


  findCatsByUser(userId: number) {
    return this.catRepository.find({ where: { user: { id: userId } }, relations: ['user'] });
  }
  
  /*findByUserId(userId: number): Promise<CatEntity[]> {
    return this.catRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], 
    });
  }*/

}
