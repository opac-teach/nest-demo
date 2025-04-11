import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentaryDto } from './dto/create-commentary.dto';
import { UpdateCommentaryDto } from './dto/update-commentary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentaryEntity } from './commentary.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentaryService {
  constructor(
    @InjectRepository(CommentaryEntity)
    private readonly commentaryRepository: Repository<CommentaryEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(req: any, createCommentaryDto: CreateCommentaryDto): Promise<CommentaryEntity> {
    const newCommentary = this.commentaryRepository.create({
      text: createCommentaryDto.text,
      cat: {id : createCommentaryDto.cat},
      user: { id: req.user.sub },
    });
    const createdCommentary = await this.commentaryRepository.save(newCommentary);
    this.eventEmitter.emit('data.crud', {
      action: 'create',
      model: 'commentary',
      commentary: createdCommentary,
    });
    return createdCommentary;
  }

  async findAll() {
    return await this.commentaryRepository.find();
  }

  async findOne(id: string) {
    const commentary = await this.commentaryRepository.findOneBy({ id });
    if (!commentary) {
      throw new NotFoundException('User not found');
    }
    return commentary;
  }

  async update(id: string, updateCommentaryDto: UpdateCommentaryDto, req: any) {
    const commentary = await this.commentaryRepository.findOneBy({ user: { id: req.user.sub }, id });
    if (!commentary) {
      throw new NotFoundException('Commentary not found');
    }
    const updatedCommentary = await this.commentaryRepository.save({
      ...commentary,
      text: updateCommentaryDto.text,
      cat: { id: updateCommentaryDto.cat },
      user: { id: req.user.sub },
    });
    this.eventEmitter.emit('data.crud', {
      action: 'update',
      model: 'commentary',
      commentary: updatedCommentary,
    });
    return updatedCommentary;
  }

  remove(id: string, req: any) {
    const commentary = this.commentaryRepository.findOneBy({ user: { id: req.user.sub }, id });
    if (!commentary) {
      throw new NotFoundException('Commentary not found');
    }
    this.commentaryRepository.delete(id);
    this.eventEmitter.emit('data.crud', {
      action: 'delete',
      model: 'commentary',
      commentary: commentary,
    });
    return `This action removes a #${id} commentary`;
  }
}
