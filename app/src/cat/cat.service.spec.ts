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
    created: new Date(),
    updated: new Date(),
    color: '11BB22',
    updateTimestamp: jest.fn(),
    userId: '1'
  };

  const mockBreed: BreedEntity = {
    id: '1',
    name: 'Fluffy',
    seed: '1234567890',
    description: 'Fluffy is a cat',
    generateSeed: jest.fn(),
  };

  const mockColor = '11BB22';

  const mockCatRepository: Partial<Repository<CatEntity>> = {
    create: jest.fn().mockImplementation((c) => c),
    find: jest.fn().mockResolvedValue([mockCat]),
    findOne: jest.fn().mockResolvedValue(mockCat),
    save: jest.fn().mockResolvedValue(mockCat),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        BreedService,
        {
          provide: getRepositoryToken(CatEntity),
          useValue: mockCatRepository,
        },
        {
          provide: 'COLORS_SERVICE',
          useValue: {
            send: jest.fn().mockReturnValue(of(mockColor)),
          },
        },
        EventEmitter2,
      ],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<CatService>(CatService);
    catRepository = module.get<Repository<CatEntity>>(
      getRepositoryToken(CatEntity),
    );
    breedService = module.get<BreedService>(BreedService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cat', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCat]);
      expect(mockCatRepository.find).toHaveBeenCalledWith({
        relations: undefined,
        where: {},
      });
    });

    it('should return an array of cat with a breedId', async () => {
      const result = await service.findAll({ breedId: '1' });
      expect(result).toEqual([mockCat]);
      expect(mockCatRepository.find).toHaveBeenCalledWith({
        where: { breedId: '1' },
      });
    });
    it('should return an array of cat with breeds', async () => {
      const result = await service.findAll({ includeBreed: true });
      expect(result).toEqual([mockCat]);
      expect(mockCatRepository.find).toHaveBeenCalledWith({
        relations: ['breed'],
        where: {},
      });
    });
  });

  it('should return an array of cat with breeds', async () => {
    const result = await service.findAll({ breedId: '1', includeBreed: true });
    expect(result).toEqual([mockCat]);
    expect(mockCatRepository.find).toHaveBeenCalledWith({
      relations: ['breed'],
      where: { breedId: '1' },
    });
  });

  describe('findOne', () => {
    it('should return a single cat', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockCat);
    });
  });

  describe('create', () => {
    it('should create a new cat', async () => {
      const newCat: CreateCatDto = {
        name: 'Fluffy',
        age: 3,
        breedId: '1',
      };

      jest.spyOn(eventEmitter, 'emit').mockImplementation((d) => true);
      jest.spyOn(breedService, 'findOne').mockResolvedValue(mockBreed);

      const result = await service.create(newCat, mockCat.userId);
      expect(breedService.findOne).toHaveBeenCalledWith(newCat.breedId);
      expect(mockCatRepository.save).toHaveBeenCalledWith({
        ...newCat,
        color: mockColor,
        userId: mockCat.userId,
      });
      expect(result).toEqual(mockCat);

      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'create',
        model: 'cat',
        cat: mockCat,
      });
    });

    it('should not create if no breed is found', async () => {
      const newCat: CreateCatDto = {
        name: 'Fluffy',
        age: 3,
        breedId: '1',
      };
      jest
        .spyOn(breedService, 'findOne')
        .mockRejectedValue(new NotFoundException());
      await expect(service.create(newCat, mockCat.userId)).rejects.toThrow(NotFoundException);
      expect(mockCatRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const updateCat: UpdateCatDto = { name: 'Fluffy updated' };
      const updatedCat: CatEntity = instanceToInstance(mockCat);
      Object.assign(updatedCat, updateCat);

      jest.spyOn(eventEmitter, 'emit').mockImplementation((d) => true);
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedCat);

      const result = await service.update('1', updateCat);
      expect(result).toEqual(updatedCat);
      expect(mockCatRepository.update).toHaveBeenCalledWith('1', updateCat);

      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'update',
        model: 'cat',
        cat: updatedCat,
      });
    });
  });
});
