import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { NotFoundException } from '@nestjs/common';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockComment = {
    id: '1',
    content: 'Test comment',
    catId: 'cat1',
    userId: 'user1',
  };

  const mockCommentsService = {
    create: jest.fn(),
    findAllByCatId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeCommentByMod: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      mockCommentsService.create.mockResolvedValue(mockComment);

      const result = await controller.create(
        { content: 'Test comment', catId: 'cat1' },
        { userId: 'user1' },
      );

      expect(mockCommentsService.create).toHaveBeenCalledWith(
        { content: 'Test comment', catId: 'cat1' },
        'user1',
      );
      expect(result).toEqual(mockComment);
    });
  });

  describe('findAllByCatId', () => {
    it('should return all comments for a given catId', async () => {
      mockCommentsService.findAllByCatId.mockResolvedValue([mockComment]);

      const result = await controller.findAllByCatId('cat1');

      expect(mockCommentsService.findAllByCatId).toHaveBeenCalledWith('cat1');
      expect(result).toEqual([mockComment]);
    });
  });

  describe('findOne', () => {
    it('should return a comment if found', async () => {
      mockCommentsService.findOne.mockResolvedValue(mockComment);

      const result = await controller.findOne('1');

      expect(mockCommentsService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException if comment is not found', async () => {
      mockCommentsService.findOne.mockRejectedValue(
        new NotFoundException('Comment not found'),
      );

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      mockCommentsService.update.mockResolvedValue(mockComment);

      const result = await controller.update(
        '1',
        { content: 'Updated comment' },
        { userId: 'user1' },
      );

      expect(mockCommentsService.update).toHaveBeenCalledWith(
        '1',
        { content: 'Updated comment' },
        'user1',
      );
      expect(result).toEqual(mockComment);
    });
  });

  describe('remove', () => {
    it('should delete a comment', async () => {
      mockCommentsService.remove.mockResolvedValue('Comment deleted');

      const result = await controller.remove('1', { userId: 'user1' });

      expect(mockCommentsService.remove).toHaveBeenCalledWith('1', 'user1');
      expect(result).toEqual('Comment deleted');
    });

    it('should throw NotFoundException if comment is not found', async () => {
      mockCommentsService.remove.mockRejectedValue(
        new NotFoundException('Comment not found'),
      );

      await expect(controller.remove('1', { userId: 'user1' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeCommentByMod', () => {
    it('should delete a comment by moderator', async () => {
      mockCommentsService.removeCommentByMod.mockResolvedValue(
        'Comment deleted',
      );

      const result = await controller.removeCommentByMod('1');

      expect(mockCommentsService.removeCommentByMod).toHaveBeenCalledWith('1');
      expect(result).toEqual('Comment deleted');
    });
  });
});
