import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateuserDto, UpdateuserDto } from '@/user/dtos/user-input.dto';
import { userEntity } from '@/user/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CatService } from '@/cat/cat.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
export interface userFindAllOptions extends FindManyOptions<userEntity> {
  catId?: string;
  includeBreed?: boolean;
}

@Injectable()
export class userService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
    private readonly catService: CatService,
    private readonly eventEmitter: EventEmitter2,
    @Inject('COLORS_SERVICE') private client: ClientProxy,
  ) {}

  async findAll(): Promise<userEntity[]> {
      return this.userRepository.find();
    }

  async findOne(id: string, includeBreed?: boolean): Promise<userEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: includeBreed ? ['breed'] : undefined,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async create(user: CreateuserDto): Promise<userEntity> {

    // const { seed } = breed;
    // const colorObservable = this.client.send<string, string>('generate_color', seed);
    // const color = await firstValueFrom(colorObservable);

    

    const newuser = this.userRepository.create({ ...user });
    const createduser = await this.userRepository.save(newuser);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'user',
      user: createduser,
    });

    return createduser;
  }

  async update(id: string, user: UpdateuserDto): Promise<userEntity> {
    const updateResponse = await this.userRepository.update(id, user);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('user not found');
    }
    const updateduser = await this.findOne(id);
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'user',
      user: updateduser,
    });
    return updateduser;
  }
}
