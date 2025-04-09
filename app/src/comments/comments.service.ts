import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '@/comments/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}
  public async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentEntity> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
    });
    return this.commentRepository.save(comment);
  }

  public async findAllByCatId(catId: string): Promise<CommentEntity[]> {
    return await this.commentRepository.find({
      where: {
        catId: catId,
      },
      relations: ['cat', 'user'],
    });
  }

  public async findAllByUserId(userId: string): Promise<CommentEntity[]> {
    return await this.commentRepository.find({
      where: {
        userId: userId,
      },
      relations: ['cat', 'user'],
    });
  }

  public async findOne(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['cat', 'user'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  public async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<CommentEntity> {
    const updatedComment = await this.commentRepository.update(
      { id, userId },
      updateCommentDto,
    );

    if (updatedComment.affected === 0) {
      throw new NotFoundException('Comment not found');
    }

    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['cat', 'user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  public async remove(id: string, userId: string): Promise<string> {
    return await this.commentRepository
      .delete({
        id: id,
        userId: userId,
      })
      .then((result) => {
        if (result.affected === 0) {
          throw new NotFoundException('Comment not found');
        }
        return 'Comment deleted';
      });
  }

  public async removeAllUserComments(userId: string): Promise<string> {
    return await this.commentRepository
      .delete({
        userId: userId,
      })
      .then((result) => {
        if (result.affected === 0) {
          throw new NotFoundException('No comments found for this user');
        }
        return 'All comments deleted';
      });
  }

  public async removeCommentByMod(commentId: string) {
    return await this.commentRepository
      .delete({
        id: commentId,
      })
      .then((result) => {
        if (result.affected === 0) {
          throw new NotFoundException('Comment not found');
        }
        return 'Comment deleted';
      });
  }
}
