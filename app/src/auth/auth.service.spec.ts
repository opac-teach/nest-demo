import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '@/auth/dtos';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser: UserEntity = {
    id: '1',
    username: 'JohnDoe',
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@test.com',
    password: 'hashedPassword123',
    hashPassword: async () => {},
    created: new Date(),
    updated: new Date(),
    cats: [],
    comments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain, hashed) => plain === hashed);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'JohnDoe',
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@test.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user already exists', async () => {
      const registerDto: RegisterDto = {
        username: 'JohnDoe',
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@test.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.CONFLICT),
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should validate a user with correct credentials', async () => {
      const email = 'johndoe@test.com';
      const password = 'password123';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
        email: mockUser.email,
        created: mockUser.created,
        updated: mockUser.updated,
      });
    });

    it('should return null if user is not found', async () => {
      const email = 'johndoe@test.com';
      const password = 'password123';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const email = 'johndoe@test.com';
      const password = 'wrongPassword';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      // jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(userService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token for a valid user', async () => {
      const token = 'jwtToken123';

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(mockUser.email, mockUser.password);

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
      expect(result).toEqual({ accessToken: token });
    });
  });
});