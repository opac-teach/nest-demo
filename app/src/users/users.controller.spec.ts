import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './users.entity';
import { CatEntity } from '@/cat/cat.entity';
import { CommentsEntity } from '@/comments/comments.entity';
import { JwtModule } from '@nestjs/jwt';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUser: UserEntity[] = [
    {
      id: '1',
      name: 'John Doe',
      password: 'test',
      description: 'wahou',
      created: new Date(),
      updated: new Date(),
      updateTimestamp: jest.fn(),
      cats: [],
      comments: [],
    },
  ];

  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    created: new Date(),
    updated: new Date(),
    color: '11BB22',
    updateTimestamp: jest.fn(),
    userId: mockUser[0].id,
    owner: mockUser[0],
    comments: [],
  };

  const mockComments: CommentsEntity[] = [
    {
      id: '1',
      content: 'This is a comment',
      created: new Date(),
      updated: new Date(),
      user: mockUser[0],
      cat: mockCat,
      updateTimestamp: jest.fn(), // Vous pouvez ignorer le comportement réel de la méthode updateTimestamp dans les tests
    },
    {
      id: '2',
      content: 'This is another comment',
      created: new Date(),
      updated: new Date(),
      user: mockUser[0],
      cat: mockCat,
      updateTimestamp: jest.fn(),
    },
  ];

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue(mockUser), // Retourne une Promise avec des commentaires mockés
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
      imports: [
        JwtModule.register({
          secret: 'testSecret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUser);
      const result = await usersController.findAll();
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });
});
