import { Test, TestingModule } from '@nestjs/testing';
import { CrossBreedingService } from './cross-breeding.service';

describe('CrossBreedingService', () => {
  let service: CrossBreedingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrossBreedingService],
    }).compile();

    service = module.get<CrossBreedingService>(CrossBreedingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
