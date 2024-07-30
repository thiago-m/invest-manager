import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../modules/user/services/user.service'; 
import { UserRepository } from '../../modules/user/user.repository';
import { CreateUserDto } from '../../modules/user/dtos/create-user.dto';
import { User } from '../../modules/user/models/user.schema'; 

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    // Mocks
    const mockUserRepository = {
      create: jest.fn(),
      getUsername: jest.fn(),
      findOneByUsername: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    it('should create a user and return the created user', async () => {
      const createUserDto: CreateUserDto = { username: 'testUser', password: 'password' };
      const result = { _id: 'user-id', ...createUserDto };

      jest.spyOn(userRepository, 'create').mockResolvedValue(result as any);

      expect(await userService.createUser(createUserDto)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a user object with id and username', async () => {
      const id = 'user-id';
      const username = 'testuser';

      jest.spyOn(userRepository, 'getUsername').mockResolvedValue(username);

      expect(await userService.findOne(id)).toEqual({ id, username });
    });
  });

  describe('findByUsernameWithPassword', () => {
    it('should return a user object if username exists', async () => {
      const userId = 'user-id';
      const user = { _id: userId, username: 'testuser', password: 'password' };

      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(user as any);

      expect(await userService.findByUsernameWithPassword(userId)).toEqual(user);
    });

    it('should return undefined if username does not exist', async () => {
      const userId = 'nonexistent-id';

      jest.spyOn(userRepository, 'findOneByUsername').mockResolvedValue(undefined);

      expect(await userService.findByUsernameWithPassword(userId)).toBeUndefined();
    });
  });

});
