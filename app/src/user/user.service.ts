import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(includeCats?: boolean): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: includeCats ? ['cats'] : undefined,
    });
  }

  async findOne(id: string, includeCats?: boolean): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: includeCats ? ['cats'] : undefined,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
    const updateResponse = await this.userRepository.update(id, user);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deleteResponse = await this.userRepository.delete(id);
    if (deleteResponse.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
