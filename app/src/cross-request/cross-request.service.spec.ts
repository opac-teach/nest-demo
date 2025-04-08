import { Test, TestingModule } from '@nestjs/testing';
import { CrossRequestService } from './cross-request.service';

describe('CrossRequestService', () => {
  let service: CrossRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrossRequestService],
    }).compile();

    service = module.get<CrossRequestService>(CrossRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
