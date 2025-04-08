import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import {EventEmitter2} from "@nestjs/event-emitter";
import {FindManyOptions, Repository} from "typeorm";
import {CreateUserDto} from "@/user/dtos/user-input.dto";
import {CatEntity} from "@/cat/cat.entity";

export interface CatFindAllOptions extends FindManyOptions<CatEntity> {
  breedId?: string;
  includeBreed?: boolean;
  userId?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<UserEntity[]> {

    return this.userRepository.find(
      {
        relations: ['cats']
      }
    );
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
    });
    const createdUser = await this.userRepository.save(newUser);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      entity: 'user',
      data: createdUser,
    });

    return createdUser;
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, user: Partial<CreateUserDto>): Promise<UserEntity> {
    const existingUser = await this.findOne(id);
    const updatedUser = { ...existingUser, ...user };
    await this.userRepository.save(updatedUser);

    this.eventEmitter.emit('data.crud', {
      action: 'update',
      entity: 'user',
      data: updatedUser,
    });

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);

    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      entity: 'user',
      data: user,
    });
  }
}
