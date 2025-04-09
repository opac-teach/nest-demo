import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { RolesEnum } from '@/auth/roles/roles.enum';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: UserEntity = {
    id: 'mocked-uuid',
    username: 'testuser',
    email: 'johndoe@gmail.com',
    password: 'hashedPassword',
    biography: 'lorem ipsum',
    role: RolesEnum.USER,
    cats: [],
    comments: [],
  };

  const mockUserService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockUser, biography: 'updated biography' }),
    remove: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'Testpassword123!',
        email: 'johndoe@gmail.com',
        biography: 'lorem ipsum',
      };

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await controller.findOne('mocked-uuid');
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('mocked-uuid');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { biography: 'updated biography' };
      const req = { userId: 'mocked-uuid' };

      const result = await controller.update(req, updateUserDto);
      expect(result).toEqual({ ...mockUser, biography: 'updated biography' });
      expect(service.update).toHaveBeenCalledWith('mocked-uuid', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const req = { userId: 'mocked-uuid' };

      const result = await controller.remove(req);
      expect(result).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith('mocked-uuid');
    });
  });
});
