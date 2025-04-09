import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { mockTheRest } from '@/lib/tests';
import { UserEntity } from './user.entity';
import { CatEntity } from '@/cat/cat.entity';
import { CatService } from '@/cat/cat.service';
import { CommentaireService } from '@/commentaire/commentaire.service';
import { CommentaireEntity } from '@/commentaire/commentaire.entity';
import { UpdateUserDto } from './dtos';
import { RequestWithUser } from '@/auth/guards/auth.guard';
import { Response } from 'express';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let catService: CatService;
  let commentaireService: CommentaireService;

  const mockCats: CatEntity[] = [
    {
      id: '1',
      name: 'Caaaaat',
      age: 1,
      breedId: '1',
      userId: '1',
      created: new Date(),
      updated: new Date(),
      color: '11BB22',
      updateTimestamp: jest.fn(),
    },
  ];

  const mockCommentaires: CommentaireEntity[] = [
    {
      id: '1',
      content: 'mon commentaire',
      userId: '1',
      catId: '21',
      created: new Date(),
      updated: new Date(),
      updateTimestamp: jest.fn(),
    },
  ];

  const mockUser: UserEntity = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
    cats: mockCats,
    commentaires: mockCommentaires,
  };

  const mockReq: Partial<RequestWithUser> = {
    user: { sub: '1', email: 'test@example.com' },
  };

  const mockRes: Partial<Response> = {
    clearCookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .useMocker(mockTheRest)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    catService = module.get<CatService>(CatService);
    commentaireService = module.get<CommentaireService>(CommentaireService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of user', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(userService.findAll).toHaveBeenCalledWith({
        includeCats: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      const result = await controller.findOne(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(mockUser.id, {
        includeCats: true,
      });
    });
  });

  describe('findCats', () => {
    it('should return an array of cats of user', async () => {
      jest.spyOn(catService, 'findAll').mockResolvedValue(mockCats);
      const result = await controller.findCats(mockUser.id);
      expect(result).toEqual(mockCats);
      expect(catService.findAll).toHaveBeenLastCalledWith({
        userId: mockUser.id,
        includeUser: true,
      });
    });
  });

  describe('findCommentaires', () => {
    it('should return an array of commentaires of user', async () => {
      jest
        .spyOn(commentaireService, 'findAll')
        .mockResolvedValue(mockCommentaires);
      const result = await controller.findCommentaires(mockUser.id);
      expect(result).toEqual(mockCommentaires);
      expect(commentaireService.findAll).toHaveBeenLastCalledWith({
        userId: mockUser.id,
        includeUser: true,
      });
    });
  });

  describe('update', () => {
    it('should update an user', async () => {
      const mockUpdateUserDto: UpdateUserDto = {
        name: 'New name',
      };
      jest.spyOn(userService, 'update').mockResolvedValue(mockUser);
      const result = await controller.update(
        mockReq as RequestWithUser,
        mockUpdateUserDto,
      );
      expect(result).toEqual(mockUser);
      expect(userService.update).toHaveBeenCalledWith(
        mockReq.user?.sub,
        mockUpdateUserDto,
      );
    });

    // TODO: update d'un user qui n'existe pas/n'est pas le notre
  });

  describe('delete', () => {
    it('should delete an user', async () => {
      jest.spyOn(userService, 'remove').mockResolvedValue();
      const result = await controller.remove(
        mockReq as RequestWithUser,
        mockRes as Response,
      );
      expect(result).toEqual({ message: 'Votre compte a bien été supprimé.' });
      expect(userService.remove).toHaveBeenCalledWith(mockReq.user?.sub);
      expect(mockRes.clearCookie).toHaveBeenCalled();
    });
  });
});
