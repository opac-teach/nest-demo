import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';

export let token: string;
const userEmail = `jonhdoe${new Date().getTime()}@gmail.com`;
const userName = `jonhdoe${new Date().getTime()}`;
let breedId: number;
let catId: string;

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
        username: userName,
        email: userEmail,
        password: 'Azerty12345!',
        biography: 'Test biography',
      })
      .expect(201);

    expect(createUserResponse.body).toHaveProperty('id');
    expect(createUserResponse.body.email).toBe(userEmail);
    expect(createUserResponse.body.username).toBe(userName);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userEmail,
        password: 'Azerty12345!',
      })
      .expect(201);

    token = loginResponse.body.token;

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

  it('should create a breed', async () => {
    const createdBreedResponse = await request(app.getHttpServer())
      .post('/breed')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test breed',
        description: 'Test breed description',
      })
      .expect(201);

    breedId = createdBreedResponse.body.id;

    expect(createdBreedResponse.body).toHaveProperty('id');
    expect(createdBreedResponse.body.name).toBe('Test breed');
    expect(createdBreedResponse.body.description).toBe(
      'Test breed description',
    );
  });

  it('should create a cat', async () => {
    const createdCatResponse = await request(app.getHttpServer())
      .post('/cat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test cat',
        breedId: 1,
        age: 2,
        description: 'Test cat description',
      })
      .expect(201);

    catId = createdCatResponse.body.id;

    expect(createdCatResponse.body).toHaveProperty('id');
    expect(createdCatResponse.body.name).toBe('Test cat');
    expect(createdCatResponse.body.age).toBe(2);
    expect(createdCatResponse.body.description).toBe('Test cat description');
  });

  it('should post a comment on a cat', async () => {
    const createdCommentResponse = await request(app.getHttpServer())
      .post('/cat/1/comment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test comment',
        catId: catId,
      })
      .expect(201);

    expect(createdCommentResponse.body).toHaveProperty('id');
    expect(createdCommentResponse.body.text).toBe('Test comment');
  });
});
