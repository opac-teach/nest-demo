import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CreateCatDto, UpdateCatDto } from './dtos';
import { NotFoundException } from '@nestjs/common';
import { CreateCrossbreedCatDto } from './dtos/create-crossbredd-cat.dto';

describe('CatController', () => {
  let controller: CatController;
  let service: CatService;

  const mockCatService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    crossbreed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        {
          provide: CatService,
          useValue: mockCatService,
        },
      ],
    }).compile();

    controller = module.get<CatController>(CatController);
    service = module.get<CatService>(CatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with correct options', async () => {
      const options = { breedId: 'breed-id', includeBreed: true };
      const result = [{ id: 'cat-id', name: 'Cat' }];
      mockCatService.findAll.mockResolvedValue(result);

      const response = await controller.findAll(options);

      expect(service.findAll).toHaveBeenCalledWith(options);
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a cat if found', async () => {
      const catId = 'cat-id';
      const result = { id: catId, name: 'Cat' };
      mockCatService.findOne.mockResolvedValue(result);

      const response = await controller.findOne(catId);

      expect(service.findOne).toHaveBeenCalledWith(catId, true);
      expect(response).toEqual(result);
    });

    it('should throw NotFoundException if cat is not found', async () => {
      mockCatService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new cat', async () => {
      const createCatDto: CreateCatDto = {
        name: 'New Cat',
        age: 1,
        breedId: 'breed-id',
      };
      const userId = 'user-id';
      const result = { id: 'cat-id', ...createCatDto };
      mockCatService.create.mockResolvedValue(result);

      const response = await controller.create(createCatDto, { userId });

      expect(service.create).toHaveBeenCalledWith(createCatDto, userId);
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update and return the updated cat', async () => {
      const updateCatDto: UpdateCatDto = { name: 'Updated Cat' };
      const catId = 'cat-id';
      const userId = 'user-id';
      const result = { id: catId, ...updateCatDto };
      mockCatService.update.mockResolvedValue(result);

      const response = await controller.update(catId, updateCatDto, { userId });

      expect(service.update).toHaveBeenCalledWith(catId, updateCatDto, userId);
      expect(response).toEqual(result);
    });

    it('should throw NotFoundException if cat is not found', async () => {
      mockCatService.update.mockRejectedValue(new NotFoundException());

      await expect(
        controller.update('nonexistent-id', {}, { userId: 'user-id' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('crossbreed', () => {
    it('should create and return a crossbred cat', async () => {
      const crossbreedDto: CreateCrossbreedCatDto = {
        catId1: 'cat1-id',
        catId2: 'cat2-id',
        name: 'Crossbred Cat',
        age: 1,
      };
      const userId = 'user-id';
      const result = { id: 'new-cat-id', ...crossbreedDto };
      mockCatService.crossbreed.mockResolvedValue(result);

      const response = await controller.crossbreed(crossbreedDto, { userId });

      expect(service.crossbreed).toHaveBeenCalledWith(crossbreedDto, userId);
      expect(response).toEqual(result);
    });

    it('should throw NotFoundException if one of the cats is not found', async () => {
      mockCatService.crossbreed.mockRejectedValue(new NotFoundException());

      await expect(
        controller.crossbreed(
          {
            catId1: 'cat1-id',
            catId2: 'cat2-id',
            name: 'Crossbred Cat',
            age: 1,
          },
          { userId: 'user-id' },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
