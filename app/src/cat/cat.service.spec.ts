import { Test, TestingModule } from '@nestjs/testing';
import { CatService } from './cat.service';
import { CatEntity } from './cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreedEntity } from '@/breed/breed.entity';
import { BreedService } from '@/breed/breed.service';
import { CreateCatDto, UpdateCatDto } from '@/cat/dtos/cat-input.dto';
import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { instanceToInstance } from 'class-transformer';
import { of } from 'rxjs';
import { mockTheRest } from '@/lib/tests';
import { it } from 'node:test';

describe('CatService', () => {
  let service: CatService;
  let breedService: BreedService;
  let catRepository: Repository<CatEntity>;
  let eventEmitter: EventEmitter2;

  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    ownerId: 1,
    color: '11BB22',
    created: new Date(),
    updated: new Date(),
    breed: {
      id: '1',
      name: 'Siamese',
      description: 'Friendly',
      seed: 'seed',
      generateSeed: jest.fn(),
      cats: [],
    },
    owner: {
      id: 1,
      email: 'test@example.com',
      username: 'test',
      password: 'hashed',
      cats: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    comments: [],
  };

  const mockCatRepository: Partial<Repository<CatEntity>> = {
    create: jest.fn().mockImplementation((cat) => cat),
    find: jest.fn().mockResolvedValue([mockCat]),
    findOne: jest.fn().mockResolvedValue(mockCat),
    save: jest.fn().mockResolvedValue(mockCat),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: getRepositoryToken(CatEntity),
          useValue: mockCatRepository,
        },
        {
          provide: 'COLORS_SERVICE',
          useValue: {
            send: jest.fn().mockReturnValue(of('11BB22')),
          },
        },
        EventEmitter2,
        BreedService,
      ],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<CatService>(CatService);
    catRepository = module.get<Repository<CatEntity>>(getRepositoryToken(CatEntity));
    breedService = module.get<BreedService>(BreedService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cats', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCat]);
    });

    it('should filter by breed', async () => {
      const result = await service.findAll({ breedId: '1' });
      expect(result).toEqual([mockCat]);
    });

    it('should include breed relation', async () => {
      const result = await service.findAll({ includeBreed: true });
      expect(result).toEqual([mockCat]);
    });
  });

  describe('findOne', () => {
    it('should return one cat', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockCat);
    });

    it('should throw if not found', async () => {
      jest.spyOn(catRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a cat', async () => {
      const createDto: CreateCatDto = {
        name: 'Mimi',
        age: 2,
        breedId: '1',
      };

      jest.spyOn(breedService, 'findOne').mockResolvedValue(mockCat.breed as BreedEntity);
      jest.spyOn(eventEmitter, 'emit');

      const result = await service.create(createDto, 1);
      expect(result).toEqual(mockCat);
      expect(catRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update if owner is correct', async () => {
      const updateDto: UpdateCatDto = { name: 'Updated' };
  
      jest.spyOn(catRepository, 'findOne').mockResolvedValue({
        ...mockCat,
        ownerId: 1, 
      });
  
      jest.spyOn(service, 'findOne').mockResolvedValue({ ...mockCat, ...updateDto });
      jest.spyOn(eventEmitter, 'emit');
  
      const result = await service.update('1', updateDto, 1);
      expect(result.name).toEqual('Updated');
    });
  
    it('should throw if not owner', async () => {
      jest.spyOn(catRepository, 'findOne').mockResolvedValue({
        ...mockCat,
        ownerId: 1,
      });
  
      await expect(service.update('1', { name: 'x' }, 999)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete if owner ok', async () => {
      jest.spyOn(eventEmitter, 'emit');
      jest.spyOn(catRepository, 'findOne').mockResolvedValue({
        ...mockCat,
        ownerId: 1,
      });
  
      await expect(service.delete('1', 1)).resolves.toBeUndefined();
      expect(catRepository.delete).toHaveBeenCalledWith('1');
    });
  
    it('should throw if not owner', async () => {
      jest.spyOn(catRepository, 'findOne').mockResolvedValue({
        ...mockCat,
        ownerId: 1,
      });
  
      await expect(service.delete('1', 999)).rejects.toThrow();
    });
  });

  describe('breedCats', () => {

    const dto = {
      catId1: 'cat-1',
      catId2: 'cat-2',
      name: 'Petit Chaton Magique',
    };

    const cat1 = { ...mockCat, id: dto.catId1, ownerId: 1 };
    const cat2 = { ...mockCat, id: dto.catId2, ownerId: 1 };

    it('should create a kitten from two cats with same breed', async () => {

    });
    
  });
  
});
