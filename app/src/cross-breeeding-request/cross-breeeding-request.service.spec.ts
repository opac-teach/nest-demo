import { Test, TestingModule } from '@nestjs/testing';
import { CrossBreeedingRequestService } from './cross-breeeding-request.service';

describe('CrossBreeedingRequestService', () => {
  let service: CrossBreeedingRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrossBreeedingRequestService],
    }).compile();

    service = module.get<CrossBreeedingRequestService>(CrossBreeedingRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
