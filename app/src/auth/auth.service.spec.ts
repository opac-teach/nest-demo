import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockTheRest } from '@/lib/tests';
import { UsersService } from '@/users/users.service';
import { Repository } from 'typeorm';
import { UsersEntity } from '@/users/entities/users.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {hashSync} from 'bcryptjs';


describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService

  const mockUser: UsersEntity = {
    id: 1,
    firstname: "Moumgne",
    lastname: "Alain",
    username: "kaiser",
    email:"moumgne@gmail.com",
    password: hashSync('14523614'),
    description: "Hello world"
  }
  const accessToken = "acesstoken"

  const mockUserRepository: Partial<Repository<UsersEntity>> = {
    create: jest.fn().mockImplementation((user) => user),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService
      ],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', async () => {
      expect(service).toBeDefined();
  });

  describe("login", () => {
    it("login service test",  async () => {
      const mockLogin = {
        username: 'kaiser',
        password: '14523614',
      };
      jest.spyOn(usersService, 'getUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessToken)

      const result = await service.login(mockLogin);
      expect(result).toEqual({accessToken: accessToken });

      expect(service).toBeDefined();
    })
  })
});
