import { Test, TestingModule } from '@nestjs/testing';
import { userService } from './user.service';
import { userEntity } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreedEntity } from '@/breed/breed.entity';
import { BreedService } from '@/breed/breed.service';
import { CreateuserDto, UpdateuserDto } from '@/user/dtos/user-input.dto';
import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { instanceToInstance } from 'class-transformer';
import { of } from 'rxjs';
import { mockTheRest } from '@/lib/tests';

describe('userService', () => {
  let service: userService;
  let breedService: BreedService;
  let userRepository: Repository<userEntity>;
  let eventEmitter: EventEmitter2;
  const mockuser: userEntity = {
    id: '1',
    name: 'Fluffy',
    description: 'homme',
    age: 21,
    sexe: 'homme',
    password:'root',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
    email:'m.d@gmail.com',
  };

  const mockuserRepository: Partial<Repository<userEntity>> = {
    create: jest.fn().mockImplementation((c) => c),
    find: jest.fn().mockResolvedValue([mockuser]),
    findOne: jest.fn().mockResolvedValue(mockuser),
    save: jest.fn().mockResolvedValue(mockuser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        userService,
        EventEmitter2,
      ],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<userService>(userService);
    userRepository = module.get<Repository<userEntity>>(
      getRepositoryToken(userEntity),
    );
    breedService = module.get<BreedService>(BreedService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of user', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockuser]);
      expect(mockuserRepository.find).toHaveBeenCalled();
    });

    /*it('should return an array of user with a catId', async () => {
      const result = await service.findAll({ catId: '1' });
      expect(result).toEqual([mockuser]);
      expect(mockuserRepository.find).toHaveBeenCalledWith({
        where: { breedId: '1' },
      });
    });*/
    it('should return an array of user with breeds', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockuser]);
      expect(mockuserRepository.find).toHaveBeenCalledWith({
        relations: ['breed'],
        where: {},
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockuser);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newuser: CreateuserDto = {
        name: 'Fluffy',
        description: 'homme',
        age: 3,
        sexe: 'homme',
        password: 'root',
      };

      jest.spyOn(eventEmitter, 'emit').mockImplementation((d) => true);

      const result = await service.create(newuser);
      expect(mockuserRepository.save).toHaveBeenCalledWith({
        ...newuser,
      });
      expect(result).toEqual(mockuser);

      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'create',
        model: 'user',
        user: mockuser,
      });
    });

    it('should not create if no breed is found', async () => {
      const newuser: CreateuserDto = {
        name: 'Fluffy',
        description: 'homme',
        age: 21,
        sexe: 'homme',
        password: 'root',
        /*catId: '1',*/
      };
      jest
        .spyOn(breedService, 'findOne')
        .mockRejectedValue(new NotFoundException());
      await expect(service.create(newuser)).rejects.toThrow(NotFoundException);
      expect(mockuserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateuser: UpdateuserDto = { name: 'Fluffy updated' };
      const updateduser: userEntity = instanceToInstance(mockuser);
      Object.assign(updateduser, updateuser);

      jest.spyOn(eventEmitter, 'emit').mockImplementation((d) => true);
      jest.spyOn(service, 'findOne').mockResolvedValue(updateduser);

      const result = await service.update('1', updateuser);
      expect(result).toEqual(updateduser);
      expect(mockuserRepository.update).toHaveBeenCalledWith('1', updateuser);

      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'update',
        model: 'user',
        user: updateduser,
      });
    });
  });
});
