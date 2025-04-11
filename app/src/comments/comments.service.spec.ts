import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentEntity } from '@/comments/entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<CommentEntity>;

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockComment = {
    id: '1',
    content: 'Test comment',
    catId: 'cat1',
    userId: 'user1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a comment', async () => {
      mockCommentRepository.create.mockReturnValue(mockComment);
      mockCommentRepository.save.mockResolvedValue(mockComment);

      const result = await service.create(
        { content: 'Test comment', catId: 'cat1' },
        'user1',
      );

      expect(mockCommentRepository.create).toHaveBeenCalledWith({
        content: 'Test comment',
        catId: 'cat1',
        userId: 'user1',
      });
      expect(mockCommentRepository.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });
  });

  describe('findAllByCatId', () => {
    it('should return all comments for a given catId', async () => {
      mockCommentRepository.find.mockResolvedValue([mockComment]);

      const result = await service.findAllByCatId('cat1');

      expect(mockCommentRepository.find).toHaveBeenCalledWith({
        where: { catId: 'cat1' },
        relations: ['cat', 'user'],
      });
      expect(result).toEqual([mockComment]);
    });
  });

  describe('findOne', () => {
    it('should return a comment if found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(mockComment);

      const result = await service.findOne('1');

      expect(mockCommentRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['cat', 'user'],
      });
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException if comment is not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a comment if found', async () => {
      mockCommentRepository.update.mockResolvedValue({ affected: 1 });
      mockCommentRepository.findOne.mockResolvedValue(mockComment);

      const result = await service.update(
        '1',
        { content: 'Updated comment' },
        'user1',
      );

      expect(mockCommentRepository.update).toHaveBeenCalledWith(
        { id: '1', userId: 'user1' },
        { content: 'Updated comment' },
      );
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException if comment is not found', async () => {
      mockCommentRepository.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.update('1', { content: 'Updated comment' }, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a comment if found', async () => {
      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1', 'user1');

      expect(mockCommentRepository.delete).toHaveBeenCalledWith({
        id: '1',
        userId: 'user1',
      });
      expect(result).toEqual('Comment deleted');
    });

    it('should throw NotFoundException if comment is not found', async () => {
      mockCommentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
