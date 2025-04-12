import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';
import * as bcrypt from 'bcrypt';

export interface UserFindAllOptions extends FindManyOptions<UserEntity> {
  includeCats?: boolean;
  includeCommentaires?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(options?: UserFindAllOptions): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: {
        cats: options?.includeCats,
        commentaires: options?.includeCommentaires,
      },
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: string, options?: UserFindAllOptions): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        cats: options?.includeCats,
        commentaires: options?.includeCommentaires,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async register(user: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const existingUser = await this.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
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
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('commentaire')
        .where('userId = :userId', { userId })
        .execute();

      const deleteResponse = await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('user')
        .where('id = :userId', { userId })
        .execute();

      if (deleteResponse.affected === 0) {
        throw new NotFoundException('User not found');
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
