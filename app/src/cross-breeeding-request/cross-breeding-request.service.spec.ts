import { Test, TestingModule } from '@nestjs/testing';
import { CrossBreeedingRequestService } from './cross-breeeding-request.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrossBreedingRequestEntity } from '@/cross-breeeding-request/entity/crossBreedingRequest.entity';
import { CatService } from '@/cat/cat.service';
import CrossBreedingRequestStatus from '@/lib/crossBreedingRequestStatus.enum';

describe('CrossBreeedingRequestService', () => {
  let service: CrossBreeedingRequestService;
  let repository: Repository<CrossBreedingRequestEntity>;
  let catService: CatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrossBreeedingRequestService,
        {
          provide: getRepositoryToken(CrossBreedingRequestEntity),
          useClass: Repository,
        },
        {
          provide: CatService,
          useValue: {
            findOne: jest.fn(),
            createCrossBreed: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CrossBreeedingRequestService>(
      CrossBreeedingRequestService,
    );
    repository = module.get<Repository<CrossBreedingRequestEntity>>(
      getRepositoryToken(CrossBreedingRequestEntity),
    );
    catService = module.get<CatService>(CatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCrossBreedingRequest', () => {
    it('should create a cross breeding request', async () => {
      const askingCat = {
        id: '1',
        userId: 'user1',
        breedId: 'breed1',
        name: 'Cat1',
        age: 2,
        created: new Date(),
        updated: new Date(),
        updateTimestamp: (): void => {},
        color: 'black',
      };
      const requestedCat = {
        id: '2',
        userId: 'user2',
        breedId: 'breed2',
        name: 'Cat2',
        age: 3,
        created: new Date(),
        updated: new Date(),
        updateTimestamp: (): void => {},
        color: 'white',
      };
      const dto = { askingCatId: '1', askedCatId: '2' };

      jest.spyOn(catService, 'findOne').mockResolvedValueOnce(askingCat);
      jest.spyOn(catService, 'findOne').mockResolvedValueOnce(requestedCat);
      jest.spyOn(repository, 'create').mockReturnValue({
        ...dto,
        askedUserId: requestedCat.userId,
        askingUserId: askingCat.userId,
        status: CrossBreedingRequestStatus.PENDING,
      } as any);
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 1,
        ...dto,
        askedUserId: requestedCat.userId,
        askingUserId: askingCat.userId,
        status: CrossBreedingRequestStatus.PENDING,
      } as any);

      const result = await service.createCrossBreedingRequest(dto, 'user1');

      expect(result).toEqual({
        id: 1,
        ...dto,
        askedUserId: 'user2',
        askingUserId: 'user1',
        status: CrossBreedingRequestStatus.PENDING,
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('acceptCrossBreedingRequest', () => {
    it('should accept a cross breeding request and create a new cat', async () => {
      const crossBreedingRequest = {
        id: 1,
        askingCatId: '1',
        askedCatId: '2',
        askedUserId: 'user2',
        askingUserId: 'user1',
        status: CrossBreedingRequestStatus.PENDING,
      };
      const cat1 = {
        id: '1',
        name: 'Cat1',
        breedId: 'breed1',
        age: 2,
        created: new Date(),
        updated: new Date(),
        updateTimestamp: (): void => {},
        color: 'black',
      };
      const cat2 = {
        id: '2',
        name: 'Cat2',
        breedId: 'breed2',
        age: 3,
        created: new Date(),
        updated: new Date(),
        updateTimestamp: (): void => {},
        color: 'white',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(crossBreedingRequest);
      jest.spyOn(catService, 'findOne').mockResolvedValueOnce(cat1);
      jest.spyOn(catService, 'findOne').mockResolvedValueOnce(cat2);
      jest
        .spyOn(catService, 'createCrossBreed')
        .mockResolvedValue('newBreedId');
      jest.spyOn(catService, 'create').mockResolvedValue({
        id: '3',
        name: 'Cat1 x Cat2',
        breedId: 'newBreedId',
        age: 0,
        created: new Date(),
        updated: new Date(),
        updateTimestamp: (): void => {},
        color: 'gray',
      });
    });
    it('should refuse a cross breeding request', async () => {
      const crossBreedingRequest = {
        id: 1,
        askingCatId: '1',
        askedCatId: '2',
        askedUserId: 'user2',
        askingUserId: 'user1',
        status: CrossBreedingRequestStatus.PENDING,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(crossBreedingRequest);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...crossBreedingRequest,
        status: CrossBreedingRequestStatus.REJECTED,
      });

      const result = await service.refuseCrossBreedingRequest(1, 'user1');

      expect(result).toBeUndefined();
      expect(repository.save).toHaveBeenCalledWith({
        ...crossBreedingRequest,
        status: CrossBreedingRequestStatus.REJECTED,
      });
    });
  });
});
