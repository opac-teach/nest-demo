import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { CommentsEntity } from './comments.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly CommentsRepository: Repository<CommentsEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, comment: CreateCommentsDto): Promise<CommentsEntity> {

    const newComment = this.CommentsRepository.create(comment);
    const createdComment = await this.CommentsRepository.save({...newComment, userId});

    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'comment',
      comment: createdComment,
    });

    return createdComment;
  }

  async findAll(): Promise<CommentsEntity[]> {
    return this.CommentsRepository.find(
      {
        relations: ['cat'],
      }
    );
  }

  async findByCat(id: string): Promise<CommentsEntity> {
    const comment = await this.CommentsRepository.findOne({
      where: { cat : {id} }
    });
    if (!comment) {
      throw new NotFoundException('Cat not found');
    }
    return comment;
  }

  // async update(id: string, user: CreateCommentsDto): Promise<CommentsEntity> {
  //   const updateResponse = await this.CommentsRepository.update(id, user);
  //   if (updateResponse.affected === 0) {
  //     throw new NotFoundException('user not found');
  //   }
  //   const updateComments = await this.findOne(id);
  //   this.eventEmitter.emit('data.crud', {
  //     action: 'update',
  //     model: 'comment',
  //     cat: updateComments,
  //   });
  //   return updateComments;
  // }

  async remove(id: string): Promise<void> {
    const comment = await this.CommentsRepository.findOne({
      where: { id }
    });
  
    if (!comment) {
      throw new NotFoundException('User not found');
    }
  
    await this.CommentsRepository.delete(id);
    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'comment',
      cat: comment,
    });
  }
  
  
}
