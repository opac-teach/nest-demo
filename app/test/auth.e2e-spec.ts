import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';

export let token: string;

describe('Auth E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should create a user and return a JWT token on login', async () => {
    const createUserResponse = await request(app.getHttpServer())
      .post('/user')
      .send({
        username: 'testuser',
        email: 'johndoe@gmail.com',
        password: 'Azerty12345!',
        biography: 'Test biography',
      })
      .expect(201);

    expect(createUserResponse.body).toHaveProperty('id');
    expect(createUserResponse.body.email).toBe('johndoe@gmail.com');

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'johndoe@gmail.com',
        password: 'Azerty12345!',
      })
      .expect(201);

    token = loginResponse.text.replace(/^"/, '').replace(/"$/, '');

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should edit the user', async () => {
    const updateUserResponse = await request(app.getHttpServer())
      .patch('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(updateUserResponse.body).toHaveProperty('id');
  });
});
