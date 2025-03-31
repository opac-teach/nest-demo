import { Test, TestingModule } from '@nestjs/testing';
import { CatService } from './cat.service';
import { CatEntity } from './cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreedEntity } from '@/breed/breed.entity';
import { BreedService } from '@/breed/breed.service';
import { CreateCatDto } from '@/cat/dtos/cat-input.dto';
import { generateColor } from '@/lib/colors';
import { NotFoundException } from '@nestjs/common';
describe('CatService', () => {
  let service: CatService;
  let breedService: BreedService;
  let catRepository: Repository<CatEntity>;

  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    created: new Date(),
    updated: new Date(),
    color: '11BB22',
    updateTimestamp: jest.fn(),
  };

  const mockBreed: BreedEntity = {
    id: '1',
    name: 'Fluffy',
    seed: '1234567890',
    description: 'Fluffy is a cat',
    generateSeed: jest.fn(),
  };

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
          provide: getRepositoryToken(BreedEntity),
          useValue: {} as Partial<Repository<BreedEntity>>,
        },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
    catRepository = module.get<Repository<CatEntity>>(
      getRepositoryToken(CatEntity),
    );
    breedService = module.get<BreedService>(BreedService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cat', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCat]);
      expect(mockCatRepository.find).toHaveBeenCalled();
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
      jest.spyOn(breedService, 'findOne').mockResolvedValue(mockBreed);
      const result = await service.create(newCat);
      expect(result).toEqual(mockCat);
      expect(mockCatRepository.save).toHaveBeenCalledWith({
        ...newCat,
        color: generateColor(mockBreed.seed),
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
      await expect(service.create(newCat)).rejects.toThrow(NotFoundException);
      expect(mockCatRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const result = await service.update('1', mockCat);
      expect(result).toEqual(true);
      expect(mockCatRepository.update).toHaveBeenCalledWith('1', mockCat);
    });
  });
});
