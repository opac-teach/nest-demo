import { Test, TestingModule } from '@nestjs/testing';
import { CatController } from '@/cat/cat.controller';
import { CatService } from '@/cat/cat.service';
import { CatEntity } from '@/cat/cat.entity';
import { mockTheRest } from '@/lib/tests';
import { RequestWithUser } from '@/auth/guards/auth.guard';
import { UpdateCatDto } from '@/cat/dtos';

describe('CatController', () => {
  let controller: CatController;
  let catService: CatService;
  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    userId: '1',
    created: new Date(),
    updated: new Date(),
    color: '11BB22',
    updateTimestamp: jest.fn(),
  };

  const mockReq: Partial<RequestWithUser> = {
    user: { sub: '1', email: 'test@example.com' },
  };

  const mockUserId = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [CatService],
    })
      .useMocker(mockTheRest)
      .compile();

    controller = module.get<CatController>(CatController);
    catService = module.get<CatService>(CatService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cat', async () => {
      jest.spyOn(catService, 'findAll').mockResolvedValue([mockCat]);
      const result = await controller.findAll();
      expect(result).toEqual([mockCat]);
      expect(catService.findAll).toHaveBeenCalledWith({
        includeBreed: true,
        includeCommentaires: true,
        includeUser: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single cat', async () => {
      jest.spyOn(catService, 'findOne').mockResolvedValue(mockCat);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockCat);
      expect(catService.findOne).toHaveBeenCalledWith('1', {
        includeCommentaires: true,
        includeBreed: true,
        includeUser: true,
      });
    });
  });

  describe('create', () => {
    it('should create a new cat', async () => {
      const mockCreateCatDto = {
        name: 'Fluffy',
        age: 3,
        breedId: '1',
      };
      jest.spyOn(catService, 'create').mockResolvedValue(mockCat);
      const result = await controller.create(
        mockCreateCatDto,
        mockReq as RequestWithUser,
      );
      expect(result).toEqual(mockCat);
      expect(catService.create).toHaveBeenCalledWith(
        mockCreateCatDto,
        mockUserId,
      );
    });
  });

  describe('update', () => {
    it('should update a cat', async () => {
      const mockUpdateCatDto: UpdateCatDto = {
        name: 'Fluffy',
        age: 3,
      };
      jest.spyOn(catService, 'update').mockResolvedValue(mockCat);
      const result = await controller.update(
        '1',
        mockUpdateCatDto,
        mockReq as RequestWithUser,
      );
      expect(result).toEqual(mockCat);
      expect(catService.update).toHaveBeenCalledWith(
        '1',
        mockUpdateCatDto,
        mockUserId,
      );
    });
  });
});
