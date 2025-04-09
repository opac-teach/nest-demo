import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async hashString(str: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(str, saltRounds);
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      username: createUserDto.username,
      description: createUserDto.description,
      email: createUserDto.email,
      password: await this.hashString(createUserDto.password),
    });
    const createdUser = await this.userRepository.save(newUser);
    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'user',
      user: createdUser,
    });
    return createdUser;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto, req: any): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: req.user.sub});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashString(updateUserDto.password);
    }
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    const savedUser = await this.userRepository.save(updatedUser);
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'user',
      user: savedUser,
    });
    return savedUser;
  }

  async remove(req: any): Promise<UserEntity> {
    
    const user = await this.userRepository.findOneBy({ id: req.user.sub });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'user',
      user,
    });
    return user;
  }
}
