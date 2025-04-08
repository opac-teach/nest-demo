import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateCommentDto, UpdateCommentDto} from "@/comment/dto/comment-input.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {CommentEntity} from "@/comment/comment.entity";
import {Repository} from "typeorm";

@Injectable()
export class CommentService {
  constructor(
      @InjectRepository(CommentEntity)
      private readonly commentRepository: Repository<CommentEntity>
  ) {}
  async create(comment: CreateCommentDto, authorId: string): Promise<CommentEntity> {
     const newComment: CommentEntity = this.commentRepository.create({...comment, authorId});
    return this.commentRepository.save(newComment)
  }

  async findAll(): Promise<CommentEntity[]> {
    return await this.commentRepository.find();
  }

  async findOne(id: string): Promise<CommentEntity> {
    const comment = await this.commentRepository.findOne({
      where: { id }
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment
  }

  async update(id: string, comment: UpdateCommentDto): Promise<CommentEntity> {
    const updateResponse = await this.commentRepository.update(id, comment);
    if (updateResponse.affected === 0) {
      throw new NotFoundException('Comment not found');
    }

    return await this.findOne(id);
  }

  async remove(id: string) {
    await this.commentRepository.delete(id);

    return 'Commentaire supprimé.'
  }
}
