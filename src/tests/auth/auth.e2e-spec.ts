import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/user/services/user.service'; 
import { UserRepository } from '../../modules/user/user.repository';
import * as bcrypt from 'bcryptjs';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../app.module';

const mockUserRepository = () => ({});

describe('AuthService (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should validate a user and return a token', async () => {
    const username = 'testuser';
    const password = 'password';

    const hashedPassword = await bcrypt.hash(password, 10);

    jest.spyOn(userService, 'findByUsernameWithPassword').mockResolvedValue({
      username,
      password: hashedPassword,
      _id: 'user-id',
    } as any);

    const result = await authService.validateUser(username, password);
    expect(result).toEqual({ username: 'testuser', _id: 'user-id' });

    const tokenResponse = await authService.login(result);
    expect(tokenResponse).toHaveProperty('access_token');
  });

  it('should return 401 for invalid login', async () => {
    jest.spyOn(userService, 'findByUsernameWithPassword').mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test-password' })
      .expect(401);

    expect(response.body.message).toEqual('Unauthorized');
  });

  it('should return a token on successful login', async () => {
    const username = 'testUser';
    const password = 'password';

    const hashedPassword = await bcrypt.hash(password, 10);

    jest.spyOn(userService, 'findByUsernameWithPassword').mockResolvedValue({
      username,
      password: hashedPassword,
      _id: 'user-id',
    } as any);
    
    jest.spyOn(authService, 'validateUser').mockResolvedValue({ _doc: {username, password} });

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({username, password})
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
  });
});