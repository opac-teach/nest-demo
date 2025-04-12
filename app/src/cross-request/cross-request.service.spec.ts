import { Test, TestingModule } from '@nestjs/testing';
import { CrossRequestService } from './cross-request.service';
import { mockTheRest } from '@/lib/tests';

describe('CrossRequestService', () => {
  let service: CrossRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrossRequestService],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<CrossRequestService>(CrossRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
