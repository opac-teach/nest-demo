import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateuserDto, UpdateuserDto } from '@/user/dtos/user-input.dto';
import { userEntity } from '@/user/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CatService } from '@/cat/cat.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';
export interface userFindAllOptions extends FindManyOptions<userEntity> {
  catId?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository: Repository<userEntity>,
    private readonly eventEmitter: EventEmitter2,
    @Inject('COLORS_SERVICE') private client: ClientProxy,
  ) {}

  async findAll(): Promise<userEntity[]> {
      return this.userRepository.find();
    }

  async findByEmail(email: string): Promise<userEntity | null> {
    return this.userRepository.findOne({ where: { email } });
    }
    

  async findOne(id: string): Promise<userEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
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

    const hashedPassword = await bcrypt.hash(user.password, 10);
    

    const newuser = this.userRepository.create({...user, password: hashedPassword,});
    const createduser = await this.userRepository.save(newuser);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'user',
      user: createduser,
    });

    return createduser;
  }

  async update(id: string, user: UpdateuserDto): Promise<userEntity> {

    const userToUpdate = { ...user };
    if (user.password) {
      userToUpdate.password = await bcrypt.hash(user.password, 10);
    }
    const updateResponse = await this.userRepository.update(id, userToUpdate);

    if (updateResponse.affected === 0) {throw new NotFoundException('user not found');}
    const updateduser = await this.findOne(id);
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'user',
      user: updateduser,
    });
    return updateduser;
  }
}
