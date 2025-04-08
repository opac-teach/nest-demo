import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      throw new NotFoundException('Commentaire not found');
    }

    return commentaire;
  }

  async create(
    commentaire: CreateCommentaireDto,
    userId: string,
  ): Promise<CommentaireEntity> {
    if (!userId) {
      throw new UnauthorizedException("ID d'utilisateur manquant");
    }

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
    const commentaireToUpdate = await this.findOne(id);
    if (commentaireToUpdate.userId !== userId) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à modifier ce commentaire",
      );
    }
    const updateResponse = await this.commentaireRepository.update(
      id,
      commentaire,
    );
    if (updateResponse.affected === 0) {
      throw new NotFoundException('Commentaire not found');
    }
    return await this.findOne(id);
  }

  async delete(id: string, userId: string): Promise<void> {
    const commentaireToDelete = await this.findOne(id);
    if (commentaireToDelete.userId !== userId) {
      throw new UnauthorizedException(
        "Vous n'êtes pas autorisé à supprimer ce commentaire",
      );
    }
    await this.commentaireRepository.delete(id);
  }
}
