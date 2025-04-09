import { Test, TestingModule } from '@nestjs/testing';
import { BreedController } from './breed.controller';
import { BreedService } from './breed.service';
import { CatService } from '@/cat/cat.service';
import { CreateBreedDto } from './dtos';
import { NotFoundException } from '@nestjs/common';

describe('BreedController', () => {
  let controller: BreedController;
  let breedService: jest.Mocked<BreedService>;
  let catService: jest.Mocked<CatService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreedController],
      providers: [
        {
          provide: BreedService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: CatService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BreedController>(BreedController);
    breedService = module.get(BreedService);
    catService = module.get(CatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all breeds', async () => {
      const breeds = [{ id: '1', name: 'Breed1', description: 'Desc1' }];
      breedService.findAll.mockResolvedValue(breeds);

      const result = await controller.findAll();
      expect(result).toEqual(breeds);
      expect(breedService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a breed by id', async () => {
      const breed = { id: '1', name: 'Breed1', description: 'Desc1' };
      breedService.findOne.mockResolvedValue(breed);

      const result = await controller.findOne('1');
      expect(result).toEqual(breed);
      expect(breedService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if breed is not found', async () => {
      breedService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
      expect(breedService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findCats', () => {
    it('should return all cats by breed id', async () => {
      const cats = [
        {
          id: '1',
          name: 'Cat1',
          age: 2,
          breedId: '1',
          color: 'black',
          created: new Date(),
          updated: new Date(),
          updateTimestamp: () => void {},
        },
      ];

      catService.findAll.mockResolvedValue(cats);

      const result = await controller.findCats('1');
      expect(result).toEqual(cats);
      expect(catService.findAll).toHaveBeenCalledWith({ breedId: '1' });
    });
  });

  describe('create', () => {
    it('should create a new breed', async () => {
      const createBreedDto = {
        name: 'Breed1',
        description: 'Desc1',
      };
      const newBreed = { id: '1', ...createBreedDto };
      breedService.create.mockResolvedValue(newBreed);

      const result = await controller.create(createBreedDto);
      expect(result).toEqual(newBreed);
      expect(breedService.create).toHaveBeenCalledWith(createBreedDto);
    });
  });
});
