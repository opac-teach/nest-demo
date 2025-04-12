import { Test, TestingModule } from '@nestjs/testing';
import { CommentaireController } from './commentaire.controller';
import { CommentaireService } from './commentaire.service';
import { mockTheRest } from '@/lib/tests';
import { CommentaireEntity } from './commentaire.entity';
import { UserEntity } from '@/user/user.entity';
import { CreateCommentaireDto, UpdateCommentaireDto } from './dtos';
import { RequestWithUser } from '@/auth/guards/auth.guard';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
describe('CommentaireController', () => {
  let controller: CommentaireController;
  let commentaireService: CommentaireService;

  const mockCommentaires: CommentaireEntity = {
    id: '1',
    content: 'mon commentaire',
    userId: '1',
    catId: '21',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
  };

  const mockReq: Partial<RequestWithUser> = {
    user: { sub: '1', email: 'test@example.com' },
  };

  const mockUser: UserEntity = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
    commentaires: [mockCommentaires],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentaireController],
      providers: [CommentaireService],
    })
      .useMocker(mockTheRest)
      .compile();

    controller = module.get<CommentaireController>(CommentaireController);
    commentaireService = module.get<CommentaireService>(CommentaireService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of commentaires', async () => {
      jest
        .spyOn(commentaireService, 'findAll')
        .mockResolvedValue([mockCommentaires]);
      const result = await controller.findAll();
      expect(result).toEqual([mockCommentaires]);
    });
  });

  describe('findOne', () => {
    it('should return a single commentaire', async () => {
      jest
        .spyOn(commentaireService, 'findOne')
        .mockResolvedValue(mockCommentaires);
      const result = await controller.findOne(mockUser.id);
      expect(result).toEqual(mockCommentaires);
      expect(commentaireService.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('create', () => {
    it('should create a new commentaire', async () => {
      const mockCreateCommentaireDto: CreateCommentaireDto = {
        content: 'mon commentaire',
        catId: '1',
      };
      jest
        .spyOn(commentaireService, 'create')
        .mockResolvedValue(mockCommentaires);
      const result = await controller.create(
        mockCreateCommentaireDto,
        mockReq as RequestWithUser,
      );
      expect(result).toEqual(mockCommentaires);
      expect(commentaireService.create).toHaveBeenCalledWith(
        mockCreateCommentaireDto,
        mockReq.user?.sub,
      );
    });
  });

  describe('update', () => {
    const mockUpdateCommentaireDto: UpdateCommentaireDto = {
      content: 'mon commentaire',
    };

    it('should update a commentaire', async () => {
      jest
        .spyOn(commentaireService, 'update')
        .mockResolvedValue(mockCommentaires);
      const result = await controller.update(
        mockCommentaires.id,
        mockUpdateCommentaireDto,
        mockReq as RequestWithUser,
      );
      expect(result).toEqual(mockCommentaires);
      expect(commentaireService.update).toHaveBeenCalledWith(
        mockCommentaires.id,
        mockUpdateCommentaireDto,
        mockReq.user?.sub,
      );
    });

    it('should update a commentaire of other user', async () => {
      jest
        .spyOn(commentaireService, 'update')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.update(
          mockCommentaires.id,
          mockUpdateCommentaireDto,
          mockReq as RequestWithUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a commentaire', async () => {
      jest.spyOn(commentaireService, 'delete').mockResolvedValue();
      const result = await controller.delete(
        mockCommentaires.id,
        mockReq as RequestWithUser,
      );
      expect(result).toEqual({ message: 'Commentaire supprimé avec succès' });
      expect(commentaireService.delete).toHaveBeenCalledWith(
        mockCommentaires.id,
        mockReq.user?.sub,
      );
    });

    it('should delete a commentaire of other user', async () => {
      jest
        .spyOn(commentaireService, 'delete')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.delete(mockCommentaires.id, mockReq as RequestWithUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
