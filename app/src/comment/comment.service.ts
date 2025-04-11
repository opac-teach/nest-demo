import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserResponseDto } from '@/user/dto/user-response';
import { CatEntity } from '@/cat/cat.entity';

@Injectable()
export class CommentService {
  constructor(
      @InjectRepository(CommentEntity)
      private readonly commentRepo: Repository<CommentEntity>,
      @InjectRepository(CatEntity)
      private readonly catRepo: Repository<CatEntity>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: UserResponseDto): Promise<CommentEntity> {
    const cat = await this.catRepo.findOneBy({ id: createCommentDto.catId });
    if (!cat) throw new NotFoundException('Cat not found');

    const comment = this.commentRepo.create({
      content:  createCommentDto.content,
      cat: { id: createCommentDto.catId },
      author: { id: user.id },
    });

    return this.commentRepo.save(comment);
  }

  async findByCat(catId: string): Promise<CommentEntity[]> {
    return this.commentRepo.find({
      where: { cat: { id: catId } },
      relations: ['author'],
    });
  }

  async findOne(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'cat'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async update(id: string, dto: UpdateCommentDto): Promise<CommentEntity> {
    await this.commentRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.commentRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Comment not found');
  }
}
