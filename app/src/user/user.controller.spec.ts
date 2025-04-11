import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { mockTheRest } from "@/lib/tests";
import {UserEntity} from "@/user/entities/user.entity";

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUser: UserEntity = {
    id: '1',
    username: 'test',
    email: 'test@example.com',
    name: 'Test',
    lastname: 'User',
    password: '1234',
    description: 'Just a mock user for testing',
    cats: [],
    comments: [],
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('create a user', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);
      const result = await controller.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith(mockUser);
    });
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(userService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { name: 'Updated Name' };
      jest.spyOn(userService, 'update').mockResolvedValue(mockUser);
      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(mockUser);
      expect(userService.update).toHaveBeenCalledWith('1', updateUserDto);
    });
  })
});
