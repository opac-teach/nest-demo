import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsEntity } from './comments.entity';
import { UserEntity } from '../users/users.entity';
import { CatEntity } from '@/cat/cat.entity';

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  const mockUser: UserEntity = {
    id: '1',
    name: 'John Doe',
    password : 'test',
    description: 'wahou',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
    cats: [],
    comments: [],
  };

  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    created: new Date(),
    updated: new Date(),
    color: '11BB22',
    updateTimestamp: jest.fn(),
    userId : mockUser.id,
    owner: mockUser,
    comments: [],
  };

  const mockComments: CommentsEntity[] = [
    {
      id: '1',
      content: 'This is a comment',
      created: new Date(),
      updated: new Date(),
      user: mockUser,
      cat: mockCat,
      updateTimestamp: jest.fn(), // Vous pouvez ignorer le comportement réel de la méthode updateTimestamp dans les tests
    },
    {
      id: '2',
      content: 'This is another comment',
      created: new Date(),
      updated: new Date(),
      user: mockUser,
      cat: mockCat,
      updateTimestamp: jest.fn(),
    },
  ];

  const mockCommentsService = {
    findAll: jest.fn().mockResolvedValue(mockComments), // Retourne une Promise avec des commentaires mockés
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    commentsService = moduleRef.get<CommentsService>(CommentsService);
    commentsController = moduleRef.get<CommentsController>(CommentsController);
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {
      const result = await commentsController.findAll();
      expect(result).toEqual(mockComments);
      expect(mockCommentsService.findAll).toHaveBeenCalled();
    });
  });
});
