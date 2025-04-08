import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './users.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
  
    const newUSer = this.UserRepository.create(user);
    const createdUser = await this.UserRepository.save(newUSer);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'user',
      cat: createdUser,
    });

    return createdUser;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.UserRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      where: { id }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
    const updateResponse = await this.UserRepository.update(id, user);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('user not found');
    }
    const updatedUser = await this.findOne(id);
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'user',
      cat: updatedUser,
    });
    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  
}
