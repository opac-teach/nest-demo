import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from '@/cat/cat.controller';
import { CatService } from '@/cat/cat.service';
import { CatEntity } from '@/cat/cat.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CatResponseDto } from '@/cat/dtos/cat-response.dto';

describe('CatController', () => {
  let controller: CatController;
  let catService: CatService;

  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    created: new Date(),
    updated: new Date(),
    color: '11BB22',
    ownerId: 1,
    owner: {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      username: 'testUser',
      cats: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    breed: {
      id: 'breed-uuid',
      name: 'Moustache IV',
      description: 'Roule partout le gars.',
      seed: '123',
      generateSeed: jest.fn(),
      cats: [],
    },
    comments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [
        {
          provide: CatService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
      imports: [EventEmitterModule.forRoot()],
    }).compile();

    controller = module.get<CatController>(CatController);
    catService = module.get<CatService>(CatService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cat', async () => {
      (catService.findAll as jest.Mock).mockResolvedValue([mockCat]);
      const result = await controller.findAll(undefined);
      expect(result).toEqual([mockCat]);
      expect(catService.findAll).toHaveBeenCalledWith({ includeBreed: true, ownerId: undefined });
    });
  });

  describe('findOne', () => {
    it('should return a single cat wrapped in CatResponseDto', async () => {
      (catService.findOne as jest.Mock).mockResolvedValue(mockCat);
      const result = await controller.findOne('1');
      expect(result).toEqual(new CatResponseDto(mockCat));
      expect(catService.findOne).toHaveBeenCalledWith('1', true);
    });
  });

  describe('create', () => {
    it('should create a new cat', async () => {
      const dto = {
        name: 'Fluffy',
        age: 3,
        breedId: 'breed-uuid',
      };
      (catService.create as jest.Mock).mockResolvedValue(mockCat);
      const result = await controller.create(dto as any, { user: { id: 1 } });
      expect(result).toEqual(mockCat);
      expect(catService.create).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const dto = {
        name: 'Updated Name',
        age: 5,
      };
      (catService.update as jest.Mock).mockResolvedValue(mockCat);
      const result = await controller.update('1', dto as any, { user: { id: 1 } });
      expect(result).toEqual(mockCat);
      expect(catService.update).toHaveBeenCalledWith('1', dto, 1);
    });
  });

  describe('delete', () => {
    it('should delete a cat', async () => {
      (catService.delete as jest.Mock).mockResolvedValue(undefined);
      const result = await controller.delete('1', { user: { id: 1 } });
      expect(result).toBeUndefined();
      expect(catService.delete).toHaveBeenCalledWith('1', 1);
    });
  });
});
