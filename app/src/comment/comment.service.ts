import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dtos/create-comment';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
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
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}
