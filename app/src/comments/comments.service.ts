export class CommentsService {}
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comments.entity';
import { UserEntity } from '@/user/user.entity';
import {CreateCommentDto} from "@/comments/dtos/comment-input.dto";
import {UpdateCommentDto} from "@/comments/dtos/comment-update.dto";  

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: UserEntity, catId: string): Promise<CommentEntity> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user,
      cat: { id: catId },
    });
    return this.commentRepository.save(comment);
  }

  async findAllByCat(catId: string): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      where: { cat: { id: catId } },
      relations: ['user'],
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId) throw new ForbiddenException('You can only update your own comments');

    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async delete(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user'] });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId) throw new ForbiddenException('You can only delete your own comments');

    await this.commentRepository.remove(comment);
  }
}