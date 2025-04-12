import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockTheRest } from '@/lib/tests';
import { LoginDto } from './dtos/auth-input.dto';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  const mockLoginDto: LoginDto = {
    email: 'john.doe@example.com',
    password: 'password',
  };

  const mockUser: UserEntity = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: bcrypt.hashSync('password', 10),
    created: new Date(),
    updated: new Date(),
    updateTimestamp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'secret',
        }),
      ],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token and user', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      const result = await service.login(mockLoginDto);
      expect(result.user).toEqual(mockUser);
      // on vérifie si le token a plus de 20 caractères
      expect(result.token.length).toBeGreaterThan(20);
    });
  });
});
