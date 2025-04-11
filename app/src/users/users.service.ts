import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './users.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async create(user: CreateUserDto): Promise<UserEntity> {

    const hashedPassword = await this.hashPassword(user.password);
    const newUser = this.UserRepository.create({
      ...user,
      password: hashedPassword,
    });
    const createdUser = await this.UserRepository.save(newUser);

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

  async findByName(username: string): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      where: { name: username }
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

  async remove(id: string): Promise<void> {
    const user = await this.UserRepository.findOne({
      where: { id }
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    await this.UserRepository.delete(id);
    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'user',
      cat: user,
    });
  }
  
  
}
