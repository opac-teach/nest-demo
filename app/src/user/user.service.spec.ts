import { UserService } from '@/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@/user/entities/user.entity';
import { CommentEntity } from '@/comments/entities/comment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateUserDto } from '@/user/dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  const createUserDto: CreateUserDto = {
    username: 'testuser',
    password: 'Testpassword123!',
    email: 'johndoe@gmail.com',
    biography: 'lorem ipsum',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({ ...dto })),
            save: jest
              .fn()
              .mockImplementation((user) =>
                Promise.resolve({ ...user, id: 'mocked-uuid' }),
              ),
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({
              id: 'mocked-uuid',
              username: 'testuser',
              email: 'johndoe@gmail.com',
              password: 'hashedPassword',
              biography: 'lorem ipsum',
            }),
            manager: {
              transaction: jest.fn().mockImplementation(async (callback) => {
                await callback({
                  delete: jest.fn().mockResolvedValue({}),
                });
              }),
            },
          },
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: {
            delete: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    jest.mock('bcrypt', () => ({
      hash: jest.fn().mockResolvedValue('hashedPassword'),
    }));

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and fetch him', async () => {
    const createdUser = await service.create(createUserDto);

    expect(createdUser.email).toEqual(createUserDto.email);
    expect(createdUser.username).toEqual(createUserDto.username);
    expect(createdUser.password).toBeDefined();
    expect(createdUser.password).not.toEqual(createUserDto.password);
    expect(createdUser.biography).toEqual(createUserDto.biography);
    expect(createdUser.id).toEqual('mocked-uuid');

    jest.spyOn(service, 'findOne').mockResolvedValue(createdUser);
    const fetchedUser = await service.findOne(createdUser.id);
    expect(fetchedUser).toEqual(createdUser);
  });

  it('should find all users', async () => {
    const user1 = await service.create({
      ...createUserDto,
      username: 'testuser1',
    });
    const user2 = await service.create({
      ...createUserDto,
      username: 'testuser2',
    });

    jest.spyOn(service, 'findAll').mockResolvedValue([user1, user2]);
    const users = await service.findAll();

    expect(users).toEqual([user1, user2]);
  });

  it('should update a user', async () => {
    const updatedUser = await service.update('mocked-uuid', {
      biography: 'updated biography',
    });

    expect(updatedUser.biography).toEqual('updated biography');
  });

  it('should remove a user', async () => {
    const userId = 'mocked-uuid';
    const removedUser = await service.remove(userId);

    expect(removedUser).toBeDefined();
    expect(removedUser.id).toEqual(userId);
  });
});
