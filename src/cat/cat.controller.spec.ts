import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatEntity } from './cat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CatController', () => {
  let controller: CatController;
  let catService: CatService;
  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        CatService,
        {
          provide: getRepositoryToken(CatEntity),
          useValue: {} as Partial<Repository<CatEntity>>,
        },
      ],
    }).compile();

    controller = module.get<CatController>(CatController);
    catService = module.get<CatService>(CatService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cat', async () => {
      jest.spyOn(catService, 'findAll').mockResolvedValue([mockCat]);
      const result = await controller.findAll();
      expect(result).toEqual([mockCat]);
      expect(catService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single cat', async () => {
      jest.spyOn(catService, 'findOne').mockResolvedValue(mockCat);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockCat);
      expect(catService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new cat', async () => {
      const mockCreateCatDto = {
        name: 'Fluffy',
        age: 3,
        breedId: '1',
      };
      jest.spyOn(catService, 'create').mockResolvedValue(mockCat);
      const result = await controller.create(mockCreateCatDto);
      expect(result).toEqual(mockCat);
      expect(catService.create).toHaveBeenCalledWith(mockCreateCatDto);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const mockUpdateCatDto = {
        name: 'Fluffy',
        age: 3,
      };
      jest.spyOn(catService, 'update').mockResolvedValue(true);
      jest.spyOn(catService, 'findOne').mockResolvedValue(mockCat);
      const result = await controller.update('1', mockUpdateCatDto);
      expect(result).toEqual(mockCat);
      expect(catService.update).toHaveBeenCalledWith('1', mockUpdateCatDto);
      expect(catService.findOne).toHaveBeenCalledWith('1');
    });
  });
});
