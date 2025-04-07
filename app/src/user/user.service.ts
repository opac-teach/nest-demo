import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from '@/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);
    console.log(user.password);
    const createdUser = await this.userRepository.save(user);
    console.log(createdUser);
    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'user',
      user: createdUser,
    });
    return createdUser;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    this.eventEmitter.emit('data.crud', {
      action: 'findAll',
      model: 'user',
      users,
    });
    return users;
  }

  public async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.eventEmitter.emit('data.crud', {
      action: 'findOne',
      model: 'user',
      user,
    });
    return user;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  public async remove(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deletedUser = await this.userRepository.remove(user);
    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'user',
      user: deletedUser,
    });
    return deletedUser;
  }
}
