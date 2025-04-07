import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(includeCats?: boolean): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: includeCats ? ['cats'] : undefined,
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
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
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async update(userId: string, user: UpdateUserDto): Promise<UserEntity> {
    const updateResponse = await this.userRepository.update(userId, user);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return this.findOne(userId);
  }

  async remove(userId: string): Promise<void> {
    const deleteResponse = await this.userRepository.delete(userId);
    if (deleteResponse.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
