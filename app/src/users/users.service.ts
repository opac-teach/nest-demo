import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository, FindManyOptions, DataSource } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';

export interface UserFindAllOptions extends FindManyOptions<UserEntity> {
  includeCommentary?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
    private datasource: DataSource,
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

    if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
      throw new Error('Missing required fields for creating a new user');
    }
    const createdUser = await this.userRepository.save(newUser);
    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'user',
      user: createdUser,
    });
    return createdUser;
  }

  async findAll(options?: UserFindAllOptions): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: options?.includeCommentary ? ['commentaries'] : undefined,
    });
  }

  async findByEmail(email: string, options?: UserFindAllOptions): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      relations: options?.includeCommentary ? ['commentaries'] : undefined,
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(id: string, options?: UserFindAllOptions): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      relations: options?.includeCommentary ? ['commentaries'] : undefined,
      where: { id },
     });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto, id: string): Promise<UserEntity> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashString(updateUserDto.password);
    }
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    if (updatedUser.affected === 0) {
      throw new NotFoundException('User not found');
    }
    const savedUser = await this.userRepository.findOne({ where: { id } });
    if (!savedUser) {
      throw new NotFoundException('User not found');
    }
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'user',
      user: savedUser,
    });
    return savedUser;
  }

  async remove(id: any): Promise<UserEntity> {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await queryRunner.manager.delete('CommentaryEntity', { user });
      await queryRunner.manager.delete('CatEntity', { user });
      await queryRunner.manager.delete('UserEntity', { id: user.id });

      await queryRunner.commitTransaction();
    }catch(err){
      await queryRunner.rollbackTransaction();
      throw new Error('Error deleting user and related entities: ' + err.message);
    }finally {
      await queryRunner.release();
    }
    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'user',
      user,
    });
    return user;
  }
}
