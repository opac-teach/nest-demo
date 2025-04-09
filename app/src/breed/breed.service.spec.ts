import { Test, TestingModule } from '@nestjs/testing';
import { BreedService } from './breed.service';
import { Repository } from 'typeorm';
import { BreedEntity } from './breed.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BreedService', () => {
  let service: BreedService;
  let repository: jest.Mocked<Repository<BreedEntity>>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BreedService,
        {
          provide: getRepositoryToken(BreedEntity),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BreedService>(BreedService);
    repository = module.get(getRepositoryToken(BreedEntity));
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all breeds', async () => {
      const breeds = [{ id: '1', name: 'Breed1', description: 'Desc1' }];
      repository.find.mockResolvedValue(breeds);

      const result = await service.findAll();
      expect(result).toEqual(breeds);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a breed by id', async () => {
      const breed = { id: '1', name: 'Breed1', description: 'Desc1' };
      repository.findOneBy.mockResolvedValue(breed);

      const result = await service.findOne('1');
      expect(result).toEqual(breed);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw NotFoundException if breed is not found', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('create', () => {
    it('should create a new breed and emit an event', async () => {
      const createBreedDto = {
        name: 'Breed1',
        description: 'Desc1',
      };
      const newBreed = { id: '1', ...createBreedDto };
      repository.create.mockReturnValue(newBreed);
      repository.save.mockResolvedValue(newBreed);

      const result = await service.create(createBreedDto);
      expect(result).toEqual(newBreed);
      expect(repository.create).toHaveBeenCalledWith(createBreedDto);
      expect(repository.save).toHaveBeenCalledWith(newBreed);
      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'create',
        model: 'breed',
        breed: newBreed,
      });
    });
  });
});
