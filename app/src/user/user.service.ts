import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@/user/dto';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/user/user.entity";
import {DeleteResult, Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>
  ) {}
  async create(user: CreateUserDto): Promise<UserEntity> {
    const newUser = this.userRepository.create({
      ...user
    });
    return await this.userRepository.save(newUser)
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({
      email
    })
  }

  async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
    const updateResponse = await this.userRepository.update(id, user)
    if (updateResponse.affected === 0) {
      throw new NotFoundException('User not found')
    }
    return await this.findOne(id)
  }

  async delete(id: string): Promise<string> {
    await this.userRepository.delete(id)
    return 'Compte supprimé'
  }
}
