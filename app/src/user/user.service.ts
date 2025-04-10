import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { CatEntity } from '../cat/cat.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CatEntity)
    private catRepository: Repository<CatEntity>,
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   const user = this.userRepository.create(createUserDto);
  //   return this.userRepository.save(user);
  // }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    if (createUserDto.catId) {
      const cat = await this.catRepository.findOne({ where: { id: createUserDto.catId } });
      if (!cat) {
        throw new NotFoundException('Cat not found');
      }
      cat.user = savedUser;
      await this.catRepository.save(cat);
    }

    return savedUser;
  }

  findAll() {
    return this.userRepository.find({ relations: ['cats'] });
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id }, relations: ['cats'] });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, relations: ['cats'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
