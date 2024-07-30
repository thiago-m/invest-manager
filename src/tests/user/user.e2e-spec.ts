import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../app.module';
import { UserService } from '../../modules/user/services/user.service';
import { CreateUserDto } from '../../modules/user/dtos/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  const mockUserService = {
    createUser: jest.fn().mockImplementation((dto) => ({
      _id: 'test-id',
      username: dto.username,
    })),
    findOne: jest.fn().mockImplementation((userId) => ({
      id: userId,
      username: 'test',
    })),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(UserService)
    .useValue(mockUserService)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    token = jwtService.sign({ userId: 'test-user-id' }); 
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/user - should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/api/user')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining({
      _id: 'test-id',
      username: 'testuser',
    }));
  });

  it('GET /api/user - should get the profile of the logged-in user', async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: jest.fn().mockImplementation((context) => {
        const req = context.switchToHttp().getRequest();
        req.user = { userId: 'test-user-id' }; 
        return true;
      }),
    })
    .overrideProvider(UserService)
    .useValue(mockUserService)
    .compile();

    const testApp = moduleFixture.createNestApplication();
    testApp.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await testApp.init();

    const response = await request(testApp.getHttpServer())
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      id: 'test-user-id',
      username: 'test',
    }));

    await testApp.close();
  });

  it('GET /api/user - should return 401 if not authenticated', async () => {
    await request(app.getHttpServer())
      .get('/api/user')
      .expect(401);
  });
});