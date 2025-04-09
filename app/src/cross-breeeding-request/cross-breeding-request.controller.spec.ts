import { Test, TestingModule } from '@nestjs/testing';
import { CrossBreeedingRequestController } from './cross-breeeding-request.controller';
import { CrossBreeedingRequestService } from './cross-breeeding-request.service';
import { CreateCrossBreedingRequestDto } from '@/cross-breeeding-request/dto/createCrossBreedingRequest.dto';
import CrossBreedingRequestStatus from '@/lib/crossBreedingRequestStatus.enum';

describe('CrossBreeedingRequestController', () => {
  let controller: CrossBreeedingRequestController;
  let service: CrossBreeedingRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrossBreeedingRequestController],
      providers: [
        {
          provide: CrossBreeedingRequestService,
          useValue: {
            createCrossBreedingRequest: jest.fn(),
            acceptCrossBreedingRequest: jest.fn(),
            refuseCrossBreedingRequest: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CrossBreeedingRequestController>(
      CrossBreeedingRequestController,
    );
    service = module.get<CrossBreeedingRequestService>(
      CrossBreeedingRequestService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCrossBreedingRequest', () => {
    it('should call service to create a cross breeding request', async () => {
      const dto: CreateCrossBreedingRequestDto = {
        askingCatId: '1',
        askedCatId: '2',
      };
      const userId = 'user1';
      const mockResult = {
        id: 1,
        askingCatId: '1',
        askedCatId: '2',
        askingUserId: 'user1',
        askedUserId: 'user2',
        status: CrossBreedingRequestStatus.PENDING,
      };

      jest
        .spyOn(service, 'createCrossBreedingRequest')
        .mockResolvedValue(mockResult);

      const result = await controller.createCrossBreedingRequest(dto, {
        userId,
      });

      expect(result).toEqual(mockResult);
      expect(service.createCrossBreedingRequest).toHaveBeenCalledWith(
        dto,
        userId,
      );
    });
  });

  describe('acceptCrossBreedingRequest', () => {
    it('should call service to accept a cross breeding request', async () => {
      const requestId = 1;
      const userId = 'user2';
      const mockResult = {
        id: '3',
        name: 'Cat1 x Cat2',
        breedId: 'newBreedId',
        age: 0,
        created: new Date(),
        updated: new Date(),
        updateTimestamp: (): void => {},
        color: 'gray',
      };

      jest
        .spyOn(service, 'acceptCrossBreedingRequest')
        .mockResolvedValue(mockResult);

      const result = await controller.acceptCrossBreedingRequest(requestId, {
        userId,
      });

      expect(result).toEqual(mockResult);
      expect(service.acceptCrossBreedingRequest).toHaveBeenCalledWith(
        requestId,
        userId,
      );
    });
  });

  describe('refuseCrossBreedingRequest', () => {
    it('should call service to refuse a cross breeding request', async () => {
      const requestId = 1;
      const userId = 'user2';

      jest.spyOn(service, 'refuseCrossBreedingRequest').mockResolvedValue();

      const result = await controller.refuseCrossBreedingRequest(requestId, {
        userId,
      });

      expect(result).toBeUndefined();
      expect(service.refuseCrossBreedingRequest).toHaveBeenCalledWith(
        requestId,
        userId,
      );
    });
  });
});
