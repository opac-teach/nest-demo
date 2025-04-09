import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '@/user/user.entity';
import { Response } from 'express';
import { mockTheRest } from '@/lib/tests';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { LoginResponseDto, LoginDto } from './dtos';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

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

  const mockLoginResponse: LoginResponseDto = {
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
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      jest.spyOn(userService, 'register').mockResolvedValue(mockUser);
      const result = await authController.register(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw a BadRequestException if the user email already exists', async () => {
      jest
        .spyOn(userService, 'register')
        .mockRejectedValue(new BadRequestException());
      await expect(authController.register(mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const res: Partial<Response> = {
      cookie: jest.fn(),
    };

    it('should login a user', async () => {
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

    it('should return a UnauthorizedException', async () => {
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());
      await expect(
        authController.login(mockLoginDto, res as Response),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
