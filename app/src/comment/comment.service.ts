import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dtos/create-comment';
import { User } from '../user/user.entity';
import { UpdateCommentDto } from './dtos/update-comment';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateCommentDto, userId: number): Promise<Comment> {
    const comment = this.commentRepo.create({
      ...createDto,
      userId: userId,
    });
    return this.commentRepo.save(comment);
  }

  async findByCat(catId: string): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { catId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepo.find({
      relations: ['user', 'cat'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateCommentDto, userId: number): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({ id });
  
    if (!comment) {
      throw new NotFoundException('Commentaire non trouvé');
    }
  
    if (comment.userId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier ce commentaire");
    }
  
    Object.assign(comment, updateDto);
    return this.commentRepo.save(comment);
  }

  async remove(id: string, userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException("Utilisateur non trouvé");
      }

      await queryRunner.manager.delete(Comment, { userId });
      await queryRunner.manager.delete(User, { id: userId });
      await queryRunner.commitTransaction();
    } catch (err) {
      // On annule toutes les opérations si ça se passe mal
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
