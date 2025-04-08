import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CommentaireEntity } from './commentaire.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentaireDto, UpdateCommentaireDto } from './dtos';

export interface CommentaireFindAllOptions
  extends FindManyOptions<CommentaireEntity> {
  catId?: string;
  userId?: string;
  includeCat?: boolean;
  includeUser?: boolean;
}

@Injectable()
export class CommentaireService {
  constructor(
    @InjectRepository(CommentaireEntity)
    private readonly commentaireRepository: Repository<CommentaireEntity>,
  ) {}

  async findAll(
    options?: CommentaireFindAllOptions,
  ): Promise<CommentaireEntity[]> {
    const commentaires = await this.commentaireRepository.find({
      relations: {
        cat: options?.includeCat,
        user: options?.includeUser,
      },
      where: {
        catId: options?.catId,
        userId: options?.userId,
      },
    });

    return commentaires;
  }

  async findOne(id: string): Promise<CommentaireEntity> {
    const commentaire = await this.commentaireRepository.findOne({
      where: { id },
    });

    if (!commentaire) {
      throw new NotFoundException('Commentaire non trouvé');
    }

    return commentaire;
  }

  async create(
    commentaire: CreateCommentaireDto,
    userId: string,
  ): Promise<CommentaireEntity> {
    const newCommentaire = this.commentaireRepository.create({
      ...commentaire,
      userId,
    });
    return await this.commentaireRepository.save(newCommentaire);
  }

  async update(
    id: string,
    commentaire: UpdateCommentaireDto,
    userId: string,
  ): Promise<CommentaireEntity> {
    // { id, userId } est une condition pour que le commentaire soit modifié par l'utilisateur qui l'a créé
    const updateResponse = await this.commentaireRepository.update(
      { id, userId },
      commentaire,
    );
    if (updateResponse.affected === 0) {
      throw new NotFoundException('Commentaire non trouvé');
    }
    return await this.findOne(id);
  }

  async delete(commentaireId: string, userId: string): Promise<void> {
    const deleteResponse = await this.commentaireRepository.delete({
      id: commentaireId,
      userId,
    });
    if (deleteResponse.affected === 0) {
      throw new NotFoundException('Commentaire non trouvé');
    }
  }
}
