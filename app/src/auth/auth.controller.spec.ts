import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '@/user/user.entity';
import { LoginDto } from './dtos/auth-input.dto';
import { Response } from 'express';
import { mockTheRest } from '@/lib/tests';
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser: UserEntity = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password',
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
  };

  const mockLoginDto: LoginDto = {
    email: 'john.doe@example.com',
    password: 'password',
  };

  const mockLoginResponse = {
    token: 'token',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker(mockTheRest)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      jest.spyOn(authService, 'register').mockResolvedValue(mockUser);
      const result = await authController.register(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const res: Partial<Response> = {
        cookie: jest.fn(),
      };
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);
      const result = await authController.login(mockLoginDto, res as Response);
      expect(result).toEqual({ message: `Bienvenue ${mockUser.name} !` });
      expect(res.cookie).toHaveBeenCalledWith(
        'authToken',
        mockLoginResponse.token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
        },
      );
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });
});
