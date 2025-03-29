import { Test, TestingModule } from '@nestjs/testing';
import { BreedService } from './breed.service';
import { BreedEntity } from './breed.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BreedService', () => {
  let service: BreedService;
  let breedRepository: Repository<BreedEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BreedService,
        {
          provide: getRepositoryToken(BreedEntity),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BreedService>(BreedService);
    breedRepository = module.get<Repository<BreedEntity>>(
      getRepositoryToken(BreedEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all breeds', async () => {
      const breeds = [new BreedEntity(), new BreedEntity()];
      jest.spyOn(breedRepository, 'find').mockResolvedValue(breeds);
      const result = await service.findAll();
      expect(result).toEqual(breeds);
      expect(breedRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single breed', async () => {
      const breed = new BreedEntity();
      jest.spyOn(breedRepository, 'findOneBy').mockResolvedValue(breed);
      const result = await service.findOne('1');
      expect(result).toEqual(breed);
      expect(breedRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
