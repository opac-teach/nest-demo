import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from "@/user/user.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateUserDto, UpdateUserDto } from "@/user/dto";
import { NotFoundException } from "@nestjs/common";
import {instanceToInstance} from "class-transformer";

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  const mockUser: UserEntity = {
    id: '1',
    name: 'Antoine Dupont',
    description: 'Joueur de rugby.',
    email: 'toto@gmail.com',
    password: 'Antoine',
    created: new Date(),
    updated: new Date(),
    cats: [],
    comments: [],
    updateTimestamp: () => new Date(),
    async hashPassword(): Promise<void> {
    }
  };

  const mockUserRepository: Partial<Repository<UserEntity>> = {
    create: jest.fn().mockImplementation(user => user),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const newUser: CreateUserDto = {
      name: 'Antoine Dupont',
      description: 'Joueur de rugby.',
      email: 'toto@gmail.com',
      password: 'Antoine',
    };

    it('should create a new user', async () => {
      const result = await service.create(newUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: UserEntity[] = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result: UserEntity = await service.findOne(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should not found exception if user is not found', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(mockUser.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUser: UpdateUserDto = {
      name: 'Antoine',
      description: 'update',
      email: 'antoine@gmail.com'
    };

    it('should update a user', async () => {
      const updatedUser: UserEntity = instanceToInstance(mockUser)
      Object.assign(updatedUser, updateUser)

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedUser);

      const result: UserEntity = await service.update(mockUser.id, updateUser);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, updateUser);
    });
  });

  describe('delete', () => {
    it('should delete a user and return a confirmation message', async () => {
      const result = await service.delete(mockUser.id);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockUser.id);
      expect(result).toBe('Compte supprimé');
    });
  });
});
