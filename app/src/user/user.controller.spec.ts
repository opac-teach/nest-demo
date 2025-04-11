import { Test, TestingModule } from '@nestjs/testing';
import { userController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { userEntity } from '@/user/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { mockTheRest } from '@/lib/tests';

describe('userController', () => {
  let controller: userController;
  let service: UserService;

  const mockuser: userEntity = {
    id: '1',
    password: 'root',
    name: 'Fluffy',
    description: 'homme',
    age: 21,
    sexe: 'homme',
    created: new Date(),
    updated: new Date(),
    email: 'm.d@gmail.com',
    updateTimestamp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [userController],
      imports: [EventEmitterModule.forRoot()],
    })
      .useMocker(mockTheRest)
      .compile();

    controller = module.get(userController);
    service = module.get(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of user', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockuser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockuser]);
      expect(service.findAll).toHaveBeenCalledWith({ includeBreed: true });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockuser);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockuser);
      expect(service.findOne).toHaveBeenCalledWith('1', true);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockCreateuserDto = {
        password: 'root',
        name: 'Fluffy',
        description: 'homme',
        age: 21,
        sexe: 'homme',
        email: 'S.t@gmail.com'
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockuser);
      const result = await controller.create(mockCreateuserDto);
      expect(result).toEqual(mockuser);
      expect(service.create).toHaveBeenCalledWith(mockCreateuserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const mockUpdateuserDto = {
        name: 'Fluffy',
        age: 3,
      };
      jest.spyOn(service, 'update').mockResolvedValue(mockuser);
      const result = await controller.update('1', mockUpdateuserDto);
      expect(result).toEqual(mockuser);
      expect(service.update).toHaveBeenCalledWith('1', mockUpdateuserDto);
    });
  });
});
