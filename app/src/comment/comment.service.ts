import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment-input.dto';
import { CommentEntity } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface CommentFindAllOptions extends FindManyOptions<CommentEntity> {
  catId?: string;
  userId?: string;
  includeCat?: boolean;
  includeUser?: boolean;
}

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  findAll(options?: CommentFindAllOptions): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      relations: {
        cat: options?.includeCat,
        user: options?.includeUser,
      },
      where: {
        catId: options?.catId,
        userId: options?.userId,
      },
    });
  }

  async findOne(
    id: string,
    options?: CommentFindAllOptions,
  ): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      relations: {
        cat: options?.includeCat,
        user: options?.includeUser,
      },
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async create(comment: CreateCommentDto): Promise<CommentEntity> {
    const newComment = this.commentRepository.create(comment);
    const createdComment = await this.commentRepository.save(newComment);

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'comment',
      comment: createdComment,
    });

    return createdComment;
  }

  async update(
    id: string,
    userId: string,
    comment: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const commentToUpdate = await this.findOne(id);

    if (commentToUpdate.userId !== userId) {
      throw new UnauthorizedException(
        'You cannot edit a comment that does not belong to you',
      );
    }

    if (!commentToUpdate) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.update(id, comment);

    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'comment',
      comment: commentToUpdate,
    });
    return commentToUpdate;
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new UnauthorizedException(
        'You cannot edit a comment that does not belong to you',
      );
    }

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.delete(id);

    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'comment',
      comment: comment,
    });
  }
}
