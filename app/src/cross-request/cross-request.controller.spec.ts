import { Test, TestingModule } from '@nestjs/testing';
import { CrossRequestController } from './cross-request.controller';
import { CrossRequestService } from './cross-request.service';

describe('CrossRequestController', () => {
  let controller: CrossRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrossRequestController],
      providers: [CrossRequestService],
    }).compile();

    controller = module.get<CrossRequestController>(CrossRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
