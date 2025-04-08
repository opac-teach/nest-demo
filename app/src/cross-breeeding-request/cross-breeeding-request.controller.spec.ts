import { Test, TestingModule } from '@nestjs/testing';
import { CrossBreeedingRequestController } from './cross-breeeding-request.controller';
import { CrossBreeedingRequestService } from './cross-breeeding-request.service';

describe('CrossBreeedingRequestController', () => {
  let controller: CrossBreeedingRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrossBreeedingRequestController],
      providers: [CrossBreeedingRequestService],
    }).compile();

    controller = module.get<CrossBreeedingRequestController>(CrossBreeedingRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
