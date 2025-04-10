import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { mockTheRest } from '@/lib/tests';
import {AuthService} from '@/auth/auth.service';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const mockToken = {access_token: "access_token"};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker(mockTheRest)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks()
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {

    it('login to your account', async () => {
      const mockLogin = {
        username: 'johndoe',
        password: 'fdj5154fdnhGJKKK',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken);
      const result = await controller.login(mockLogin);
      expect(result).toEqual(mockToken);
      expect(authService.login).toHaveBeenCalledWith(mockLogin);
    })
  })
});
