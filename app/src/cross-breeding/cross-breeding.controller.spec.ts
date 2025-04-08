import { Test, TestingModule } from '@nestjs/testing';
import { CrossBreedingController } from './cross-breeding.controller';
import { CrossBreedingService } from './cross-breeding.service';

describe('CrossBreedingController', () => {
  let controller: CrossBreedingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrossBreedingController],
      providers: [CrossBreedingService],
    }).compile();

    controller = module.get<CrossBreedingController>(CrossBreedingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
