import { Test, TestingModule } from '@nestjs/testing';
import { BreedController } from './breed.controller';
import { BreedService } from './breed.service';
import {BreedEntity} from "@/breed/breed.entity";
import {mockTheRest} from "@/lib/tests";
import {NotFoundException} from "@nestjs/common";

describe('BreedController', () => {
  let controller: BreedController;
  let breedService: BreedService;

  const mockBreed: BreedEntity = {
    generateSeed(): void {
    },
    id: "1",
    name: "Persian",
    description: "A long-haired breed of cat."

  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BreedController],
      providers: [BreedService],
    })
      .useMocker(mockTheRest)
      .compile();


    controller = module.get<BreedController>(BreedController);
    breedService = module.get<BreedService>(BreedService);

    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of breeds', async () => {
      jest.spyOn(breedService, 'findAll').mockResolvedValue([mockBreed]);
      const result = await controller.findAll();
      expect(result).toEqual([mockBreed]);
      expect(breedService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single breed by id', async () => {
      jest.spyOn(breedService, 'findOne').mockResolvedValue(mockBreed);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockBreed);
      expect(breedService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if breed is not found', async () => {
      jest.spyOn(breedService, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(breedService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('create', () => {
    it('should create a new breed', async () => {
      const createBreedDto = { name: 'Siamese', description: 'A short-haired breed.' };
      const createdBreed = { ...mockBreed, ...createBreedDto, id: '2', generateSeed(): void {} };

      jest.spyOn(breedService, 'create').mockResolvedValue(createdBreed);
      const result = await controller.create(createBreedDto);
      expect(result).toEqual(createdBreed);
      expect(breedService.create).toHaveBeenCalledWith(createBreedDto);
    });
  });
})