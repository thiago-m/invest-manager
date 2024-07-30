import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../app.module';
import { CreateInvestDto } from '../../modules/invest/dtos/create-invest.dto'; 
import { InvestService } from '../../modules/invest/services/invest.service';

describe('InvestController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let token: string;

  const mockInvestService = {
    create: jest.fn().mockImplementation((dto, userId) => ({
      ...dto,
      user_id: userId,
      _id: 'test-id',
      __v: 0
    })),
    findAll: jest.fn().mockImplementation(userId => [
      {
        _id: 'test-id',
        owner: 'Test User',
        user_id: userId,
        create_date: Date.now(),
        initial_value: 1000,
        active: true,
        earnings: []
      }
    ]),
    findById: jest.fn().mockImplementation((id, userId) => ({
      _id: id,
      owner: 'Test User',
      user_id: userId,
      create_date: Date.now(),
      initial_value: 1000,
      active: true,
      earnings: []
    })),
    retreat: jest.fn().mockImplementation((id, userId) => ({
      _id: id,
      owner: 'Test User',
      user_id: userId,
      create_date: Date.now(),
      initial_value: 1000,
      active: false,
      earnings: [],
      withdrawn_value: 1100,  // Mocked withdrawal value
    })),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(InvestService)
    .useValue(mockInvestService)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    token = jwtService.sign({ userId: 'test-user-id' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/invest - should create an investment', async () => {
    const createInvestDto: CreateInvestDto = {
      owner: 'Test User',
      initial_value: 1000,
      create_date: 1722294229773
    };

    const response = await request(app.getHttpServer())
      .post('/api/invest')
      .set('Authorization', `Bearer ${token}`)
      .send(createInvestDto)
      .expect(201);

    expect(response.body).toEqual(expect.objectContaining({
      owner: 'Test User',
      initial_value: 1000,
      create_date: 1722294229773,
      _id: 'test-id',
      __v: 0
    }));
  });

  it('GET /api/invest - should get all investments for the user', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/invest')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: '1', limit: '10' })
      .expect(200);

    expect(response.body).toBeInstanceOf(Object);
  });

  it('GET /api/invest/:id - should get a single investment by id', async () => {
    const investmentId = 'test-id';

    const response = await request(app.getHttpServer())
      .get(`/api/invest/${investmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      _id: investmentId,
      owner: 'Test User',
      initial_value: 1000,
      active: true,
    }));
  });

  it('PATCH /api/invest/:id - should update an investment by id', async () => {
    const investmentId = 'test-id';

    const response = await request(app.getHttpServer())
      .patch(`/api/invest/${investmentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({
      _id: investmentId,
      owner: 'Test User',
      active: false,
      withdrawn_value: 1100,
    }));
  });

});
