import { Test, TestingModule } from '@nestjs/testing';
import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';

describe('ColorsController', () => {
  let controller: ColorsController;
  let service: ColorsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorsController],
      providers: [ColorsService],
    }).compile();

    controller = module.get<ColorsController>(ColorsController);
    service = module.get<ColorsService>(ColorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate a color', () => {
    jest.spyOn(service, 'getColors').mockReturnValue('123456');
    const color = controller.generateColor('123');
    expect(color).toBe('123456');
  });
});
