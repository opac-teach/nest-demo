import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import {EventEmitter2} from "@nestjs/event-emitter";
import {Repository} from "typeorm";
import {CreateUserDto} from "@/user/dtos/user-input.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
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
}
