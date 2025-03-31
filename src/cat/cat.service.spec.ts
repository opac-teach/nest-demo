import { Test, TestingModule } from '@nestjs/testing';
import { CatService } from './cat.service';
import { CatEntity } from './cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CatService', () => {
  let service: CatService;
  let catRepository: Repository<CatEntity>;

  const mockCat = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    created: new Date(),
  };

  const mockCatRepository: Partial<Repository<CatEntity>> = {
    create: jest.fn().mockReturnValue(mockCat),
    find: jest.fn().mockResolvedValue([mockCat]),
    findOneBy: jest.fn().mockResolvedValue(mockCat),
    save: jest.fn().mockResolvedValue(mockCat),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: getRepositoryToken(CatEntity),
          useValue: mockCatRepository,
        },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
    catRepository = module.get<Repository<CatEntity>>(
      getRepositoryToken(CatEntity),
    );
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
      const result = await service.findAll({ where: { breedId: '1' } });
      expect(result).toEqual([mockCat]);
      expect(mockCatRepository.find).toHaveBeenCalledWith({
        where: { breedId: '1' },
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
      const result = await service.create(mockCat);
      expect(result).toEqual(mockCat);
      expect(mockCatRepository.save).toHaveBeenCalledWith(mockCat);
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
