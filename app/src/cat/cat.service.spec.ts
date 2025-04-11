import { Test, TestingModule } from '@nestjs/testing';
import { CatService } from './cat.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatEntity } from './cat.entity';
import { BreedService } from '@/breed/breed.service';
import { UserService } from '@/user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCrossbreedCatDto } from '@/cat/dtos/create-crossbredd-cat.dto';

describe('CatService', () => {
  let service: CatService;
  let catRepository: Repository<CatEntity>;
  let breedService: BreedService;
  let userService: UserService;
  let eventEmitter: EventEmitter2;

  const mockCatRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockBreedService = {
    create: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockCat = {
    id: 'mocked-cat-id',
    name: 'Mocked Cat',
    age: 2,
    breedId: 'mocked-breed-id',
    userId: 'mocked-user-id',
    color: '11BB22',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatService,
        {
          provide: getRepositoryToken(CatEntity),
          useValue: mockCatRepository,
        },
        {
          provide: BreedService,
          useValue: mockBreedService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
        {
          provide: 'COLORS_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CatService>(CatService);
    catRepository = module.get<Repository<CatEntity>>(
      getRepositoryToken(CatEntity),
    );
    breedService = module.get<BreedService>(BreedService);
    userService = module.get<UserService>(UserService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all cats', async () => {
      mockCatRepository.find.mockResolvedValue([mockCat]);

      const result = await service.findAll();
      expect(catRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockCat]);
    });
  });

  describe('findOne', () => {
    it('should return a cat if found', async () => {
      mockCatRepository.findOne.mockResolvedValue(mockCat);

      const result = await service.findOne('mocked-cat-id', true, true);
      expect(catRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'mocked-cat-id' },
        relations: ['breed', 'user'],
      });
      expect(result).toEqual(mockCat);
    });

    it('should throw NotFoundException if cat is not found', async () => {
      mockCatRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new cat', async () => {
      const createCatDto = { name: 'New Cat', age: 1, breedId: 'breed-id' };
      const userId = 'user-id';
      const savedCat = { ...mockCat, ...createCatDto };

      mockUserService.findOne.mockResolvedValue({ id: userId });
      mockCatRepository.create.mockReturnValue(savedCat);
      mockCatRepository.save.mockResolvedValue(savedCat);

      const result = await service.create(createCatDto, userId);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(catRepository.create).toHaveBeenCalledWith({
        ...createCatDto,
        color: '11BB22',
      });
      expect(catRepository.save).toHaveBeenCalledWith(savedCat);
      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'create',
        model: 'cat',
        cat: savedCat,
      });
      expect(result).toEqual(savedCat);
    });
  });

  describe('update', () => {
    it('should update and return the updated cat', async () => {
      const updateCatDto = { name: 'Updated Cat' };
      const userId = 'user-id';

      mockCatRepository.findOne.mockResolvedValue(mockCat);
      mockCatRepository.update.mockResolvedValue(undefined);
      mockCatRepository.findOne.mockResolvedValue({
        ...mockCat,
        ...updateCatDto,
      });

      const result = await service.update(
        'mocked-cat-id',
        updateCatDto,
        userId,
      );
      expect(catRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'mocked-cat-id', userId },
        relations: ['breed'],
      });
      expect(catRepository.update).toHaveBeenCalledWith(
        mockCat.id,
        updateCatDto,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith('data.crud', {
        action: 'update',
        model: 'cat',
        cat: { ...mockCat, ...updateCatDto },
      });
      expect(result).toEqual({ ...mockCat, ...updateCatDto });
    });

    it('should throw NotFoundException if cat is not found', async () => {
      mockCatRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', {}, 'user-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('crossbreed', () => {
    it('should return existing breedId if both cats have same breedId', async () => {
      const cat1 = {
        breedId: 'same-breed-id',
        breed: { name: 'Breed' },
      } as CatEntity;
      const cat2 = {
        breedId: 'same-breed-id',
        breed: { name: 'Breed' },
      } as CatEntity;

      const result = await service.createCrossBreed(cat1, cat2);

      expect(result).toBe('same-breed-id');
      expect(mockBreedService.create).not.toHaveBeenCalled();
    });
    it('should create new breed and return its id if cats have different breedId', async () => {
      const cat1 = {
        breedId: 'breed1-id',
        breed: { name: 'Breed1' },
      } as CatEntity;
      const cat2 = {
        breedId: 'breed2-id',
        breed: { name: 'Breed2' },
      } as CatEntity;
      const newBreed = { id: 'new-breed-id' };

      mockBreedService.create.mockResolvedValue(newBreed);

      const result = await service.createCrossBreed(cat1, cat2);

      expect(mockBreedService.create).toHaveBeenCalledWith({
        name: 'Breed1 x Breed2',
        description: 'Crossbreed',
      });
      expect(result).toBe('new-breed-id');
    });

    it('should create and return a crossbred cat', async () => {
      const userId = 'user-id';
      const dto: CreateCrossbreedCatDto = {
        catId1: 'cat1-id',
        catId2: 'cat2-id',
        name: 'Crossbred Cat',
        age: 1,
      };

      const cat1 = {
        id: 'cat1-id',
        breedId: 'breed1-id',
        breed: { name: 'Breed1' },
      } as CatEntity;
      const cat2 = {
        id: 'cat2-id',
        breedId: 'breed2-id',
        breed: { name: 'Breed2' },
      } as CatEntity;
      const newBreedId = 'new-breed-id';
      const createdCat = { id: 'new-cat-id' } as CatEntity;
      const savedCat = { ...createdCat, name: dto.name } as CatEntity;

      mockCatRepository.findOne
        .mockResolvedValueOnce(cat1)
        .mockResolvedValueOnce(cat2);

      jest.spyOn(service, 'createCrossBreed').mockResolvedValue(newBreedId);
      mockCatRepository.create.mockReturnValue(createdCat);
      mockCatRepository.save.mockResolvedValue(savedCat);
      jest.spyOn(service, 'findOne').mockResolvedValue(savedCat);

      const result = await service.crossbreed(dto, userId);

      expect(result).toBe(savedCat);
    });

    it('should throw NotFoundException if one of the cats or breeds is not found', async () => {
      mockCatRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.crossbreed(
          {
            catId1: 'cat1-id',
            catId2: 'cat2-id',
            name: 'Crossbred Cat',
            age: 1,
          },
          'user-id',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
