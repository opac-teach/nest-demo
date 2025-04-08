import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/user-input.dto';
import { UserEntity } from './user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface UserFindAllOptions extends FindManyOptions<UserEntity> {
  includeCats?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(options?: UserFindAllOptions): Promise<UserEntity[]> {
    console.log(options?.includeCats);
    return this.userRepository.find({
      relations: {
        cats: options?.includeCats,
      },
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        cats: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(user);
    const createdUser = await this.userRepository.save(newUser);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'user',
      cat: createdUser,
    });

    return createdUser;
  }

  async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
    const updateResponse = await this.userRepository.update(id, user);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('Cat not found');
    }

    const updatedUser = await this.findOne(id);

    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'user',
      cat: updatedUser,
    });

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const userToDelete = await this.findOne(id);

    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'user',
      cat: userToDelete,
    });
  }
}
