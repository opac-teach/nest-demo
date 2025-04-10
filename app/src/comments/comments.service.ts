import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '@/comments/entities/comment.entity';
import { Repository } from 'typeorm';
import { UsersService } from '@/users/users.service';
import { CatService } from '@/cat/cat.service';
import { CatEntity } from '@/cat/entities/cat.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  // creation d'un commentaire
  async create(createCommentDto: CreateCommentDto): Promise<{message: string}> {
    return {message: `User already exists`};
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
