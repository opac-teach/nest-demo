import { Test, TestingModule } from '@nestjs/testing';
import { CommentaireService } from './commentaire.service';
import { mockTheRest } from '@/lib/tests';
import { CommentaireEntity } from './commentaire.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RequestWithUser } from '@/auth/guards/auth.guard';
import { CreateCommentaireDto, UpdateCommentaireDto } from './dtos';
import { instanceToInstance } from 'class-transformer';

describe('CommentaireService', () => {
  let service: CommentaireService;
  let commentaireRepository: Repository<CommentaireEntity>;

  const mockCommentaire: CommentaireEntity = {
    id: '1',
    content: 'mon commentaire',
    userId: '1',
    catId: '1',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
  };

  const mockUserId = '2';

  const mockCommentaireRepository: Partial<Repository<CommentaireEntity>> = {
    create: jest.fn().mockImplementation((c) => c),
    find: jest.fn().mockResolvedValue([mockCommentaire]),
    findOne: jest.fn().mockResolvedValue(mockCommentaire),
    save: jest.fn().mockResolvedValue(mockCommentaire),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentaireService,
        {
          provide: getRepositoryToken(CommentaireEntity),
          useValue: mockCommentaireRepository,
        },
      ],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<CommentaireService>(CommentaireService);
    commentaireRepository = module.get<Repository<CommentaireEntity>>(
      getRepositoryToken(CommentaireEntity),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of commentaires', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCommentaire]);
      expect(mockCommentaireRepository.find).toHaveBeenCalledWith({
        relations: {},
        where: {},
      });
    });

    it('should return an array of commentaires with a catId', async () => {
      const result = await service.findAll({ catId: '1' });
      expect(result).toEqual([mockCommentaire]);
      expect(mockCommentaireRepository.find).toHaveBeenCalledWith({
        where: { catId: '1' },
        relations: {},
      });
    });

    it('should return an array of commentaires with a userId', async () => {
      const result = await service.findAll({ userId: '1' });
      expect(result).toEqual([mockCommentaire]);
      expect(mockCommentaireRepository.find).toHaveBeenCalledWith({
        where: { userId: '1' },
        relations: {},
      });
    });

    it('should return an array of commentaires with a catId and a userId', async () => {
      const result = await service.findAll({ catId: '1', userId: '1' });
      expect(result).toEqual([mockCommentaire]);
      expect(mockCommentaireRepository.find).toHaveBeenCalledWith({
        where: { catId: '1', userId: '1' },
        relations: {},
      });
    });
  });

  describe('findOne', () => {
    it('should return a commentaire', async () => {
      const result = await service.findOne(mockCommentaire.id);
      expect(result).toEqual(mockCommentaire);
      expect(mockCommentaireRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCommentaire.id },
        relations: {},
      });
    });

    it('should return a commentaire with a cat', async () => {
      const result = await service.findOne(mockCommentaire.id, {
        includeCat: true,
      });
      expect(result).toEqual(mockCommentaire);
      expect(mockCommentaireRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCommentaire.id },
        relations: { cat: true },
      });
    });

    it('should return a commentaire with a user', async () => {
      const result = await service.findOne(mockCommentaire.id, {
        includeUser: true,
      });
      expect(result).toEqual(mockCommentaire);
      expect(mockCommentaireRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCommentaire.id },
        relations: { user: true },
      });
    });

    it('should return a commentaire with a cat and a user', async () => {
      const result = await service.findOne(mockCommentaire.id, {
        includeCat: true,
        includeUser: true,
      });
      expect(result).toEqual(mockCommentaire);
      expect(mockCommentaireRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCommentaire.id },
        relations: { cat: true, user: true },
      });
    });

    it('should return an NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.findOne('321')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a commentaire', async () => {
      const newCommentaire: CreateCommentaireDto = {
        content: 'mon commentaire',
        catId: '1',
      };
      const result = await service.create(
        newCommentaire,
        mockCommentaire.userId,
      );
      expect(mockCommentaireRepository.create).toHaveBeenCalledWith({
        ...newCommentaire,
        userId: mockCommentaire.userId,
      });
      expect(mockCommentaireRepository.save).toHaveBeenCalledWith({
        ...newCommentaire,
        userId: mockCommentaire.userId,
      });
      expect(result).toEqual(mockCommentaire);
    });
  });

  describe('update', () => {
    it('should update a commentaire', async () => {
      const updateCommentaire: UpdateCommentaireDto = {
        content: 'mon commentaire',
      };
      const updatedCommentaire: CommentaireEntity =
        instanceToInstance(mockCommentaire);
      Object.assign(updatedCommentaire, updateCommentaire);

      const result = await service.update(
        mockCommentaire.id,
        mockCommentaire,
        mockCommentaire.userId,
      );
      expect(result).toEqual(mockCommentaire);
      expect(mockCommentaireRepository.update).toHaveBeenCalledWith(
        { id: mockCommentaire.id, userId: mockCommentaire.userId },
        mockCommentaire,
      );
    });

    it('should return an NotFoundException', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
      await expect(
        service.update('321', mockCommentaire, mockCommentaire.userId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
