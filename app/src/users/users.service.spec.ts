import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockTheRest } from '@/lib/tests';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToInstance } from 'class-transformer';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<UserEntity>;
  let eventEmitter: EventEmitter2;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      delete: jest.fn(),
    },
  };
  
  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

    const mockUser: UserEntity = {
      id: '1',
      name: 'Lucas',
      email: 'test',
      username: 'test',
      description: 'test',
      password: 'test',
      created: new Date(),
      updated: new Date(),
      cats: [],
      commentaries: [],
      updateTimestamp: jest.fn(),
    }

    const mockUserRepository: Partial<Repository<UserEntity>> = {
      create: jest.fn().mockImplementation((c) => c),
      find: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getRepositoryToken(UserEntity),
        useValue: mockUserRepository,
      },
      {
        provide: DataSource,
        useValue: mockDataSource,
      },
      EventEmitter2],
    })
    .useMocker(mockTheRest)
    .compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    describe('create', () => {
      it('should create a user', async () => {
        const createUserDto = {
          name: 'Lucas',
          email: 'test',
          username: 'test',
          description: 'test',
          password: 'test',
        };

        jest.spyOn(eventEmitter, 'emit').mockImplementation((d) => true);
        jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);

        const result = await service.create(createUserDto);
        expect(userRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: createUserDto.name,
            email: createUserDto.email,
            username: createUserDto.username,
            description: createUserDto.description,
            password: expect.any(String),
          }),
        );
        expect(userRepository.save).toHaveBeenCalledWith(result);
        expect(result).toEqual(mockUser);
      });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test';
      const result = await service.findByEmail(email);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const result = await service.findOne(id);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUser: UpdateUserDto = { name: 'Lucas updated' };
      const updatedUser: UserEntity = instanceToInstance(mockUser);
      Object.assign(updatedUser, updateUser);

      jest.spyOn(eventEmitter, 'emit').mockImplementation((d) => true);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(updatedUser);

      const result = await service.update(updateUser, '1');
      expect(result).toEqual(updatedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', updateUser);
      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'update',
        model: 'user',
        user: updatedUser,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1';
      const result = await service.remove({ user: { sub: id } });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      await userRepository.manager.queryRunner?.manager.delete(UserEntity, { id });
      expect(userRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });
}); 
