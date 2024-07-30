import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/user/services/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsernameWithPassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user without password if validation is successful', async () => {
      const user = { username: 'test', password: 'hashedPassword' };
      const plainPassword = 'password';
      jest.spyOn(userService, 'findByUsernameWithPassword').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUser('test', plainPassword);
      expect(result).toEqual({ username: 'test' });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userService, 'findByUsernameWithPassword').mockResolvedValue(null);

      const result = await service.validateUser('test', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = { username: 'test', password: 'hashedPassword' };
      jest.spyOn(userService, 'findByUsernameWithPassword').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      const result = await service.validateUser('test', 'wrongPassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { username: 'test', _id: '123' };
      const token = 'jwtToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
    });
  });
});
