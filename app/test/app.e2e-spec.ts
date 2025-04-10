import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule, registerGlobals } from '@/app.module';
import { CreateBreedDto } from '@/breed/dtos/create-breed';
import { CreateCatDto } from '@/cat/dtos';
import { BreedResponseDto } from '@/breed/dtos';
import { CatResponseDto } from '@/cat/dtos';
import { Socket, io } from 'socket.io-client';
import { wait } from '@/lib/utils';
import { CreateUserDto } from '@/user/dtos';
import { AuthGuard } from '@/auth/guards/auth.guard';
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: ReturnType<INestApplication['getHttpServer']>;
  let ioClient: Socket;
  let authToken: string;
  let userId: string;
  // let events: { event: string; data: any }[] = [];

  const inputBreed: CreateBreedDto = {
    name: 'Fluffy',
    description: 'A fluffy breed',
  };

  const inputCat: CreateCatDto = {
    name: 'Alfred',
    age: 1,
    breedId: '',
  };

  const inputUser: CreateUserDto = {
    email: 'test@test.com',
    password: 'password',
    name: 'Test',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideGuard(AuthGuard)
      // .useValue({
      //   canActivate: (context: ExecutionContext) => {
      //     const request = context.switchToHttp().getRequest();
      //     if (request.headers.cookie?.includes('authToken=')) {
      //       request.user = {
      //         sub: userId,
      //         email: inputUser.email,
      //       };
      //       return true;
      //     }
      //     return false;
      //   },
      // })
      .compile();

    app = moduleFixture.createNestApplication();
    registerGlobals(app);

    await app.init();

    server = app.getHttpServer();

    app.listen(9001);
    // ioClient = io('http://localhost:9001', {
    //   autoConnect: false,
    //   transports: ['websocket', 'polling'],
    // });
    // ioClient.connect();
    // ioClient.emit('subscribe', { name: 'test' });
    // ioClient.onAny((event, data) => {
    //   events.push({ event, data });
    // });
  });

  // afterEach(async () => {
  //   events = [];
  // });

  afterAll(async () => {
    // ioClient.offAny();
    // ioClient.disconnect();
    await app.close();
  });

  it('Health check', () => {
    request(server).get('/').expect(200).expect('OK');
  });

  describe('Auth', () => {
    it('should create and login a user', async () => {
      const allUsers = await request(server).get('/user').expect(200);
      const user = allUsers.body.find((user) => user.email === inputUser.email);
      if (!user) {
        const res = await request(server)
          .post('/auth/register')
          .send(inputUser)
          .expect(201);

        expect(res.body.id).toBeDefined();
        expect(res.body.email).toBe(inputUser.email);
        expect(res.body.name).toBe(inputUser.name);
        userId = res.body.id;
      } else {
        userId = user.id;
      }

      const loginRes = await request(server)
        .post('/auth/login')
        .send({ email: inputUser.email, password: inputUser.password })
        .expect(200);

      expect(loginRes.body.message).toBe(`Bienvenue ${inputUser.name} !`);
      expect(loginRes.body.token).toBeDefined();
      authToken = loginRes.body.token;
    });

    it('should reject unauthenticated requests', async () => {
      await request(server).get('/auth/me').expect(401);
    });

    it('should get the current user', async () => {
      console.log('authToken', authToken);
      const res = await request(server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.email).toBe(inputUser.email);
    });
  });

  describe('User', () => {
    it('should get one user', async () => {
      const res = await request(server)
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.email).toBe(inputUser.email);
    });
  });

  describe('Breed', () => {
    it('should create a breed', async () => {
      const res = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inputBreed)
        .expect(201);

      expect(res.body.name).toBe(inputBreed.name);
      expect(res.body.description).toBe(inputBreed.description);
      expect(res.body.id).toBeDefined();
      expect(res.body.seed).not.toBeDefined();
      // expect(events).toContainEqual({
      //   event: 'data.crud',
      //   data: {
      //     action: 'create',
      //     model: 'breed',
      //     breed: res.body,
      //   },
      // });
    });

    it('should rejects wrong inputs', async () => {
      await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'A fluffy breed',
        })
        .expect(400);
      await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
        })
        .expect(400);
    });

    it('should get all breeds', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inputBreed)
        .expect(201);
      const res = await request(server)
        .get('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body).toContainEqual(createdBreed);
    });

    it('should get all cats of a breed', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inputBreed)
        .expect(201);

      const { body: createdCat } = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);
      const { body: createdCat2 } = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);

      const res = await request(server)
        .get(`/breed/${createdBreed.id}/cats`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toEqual([createdCat, createdCat2]);
    });
  });

  describe('Cat', () => {
    let breed: BreedResponseDto;
    let cat: CatResponseDto;

    beforeAll(async () => {
      const res = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inputBreed)
        .expect(201);
      breed = res.body;
      const catRes = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .expect(201);
      cat = catRes.body;
    });

    it('should create a cat', async () => {
      const res = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .expect(201);

      expect(res.body.name).toBe(inputCat.name);
      expect(res.body.age).toBe(inputCat.age);
      expect(res.body.id).toBeDefined();
      expect(res.body.color.length).toBe(6);
      // expect(events).toContainEqual({
      //   event: 'data.crud',
      //   data: {
      //     action: 'create',
      //     model: 'cat',
      //     cat: res.body,
      //   },
      // });
    });

    it('should get all cats', async () => {
      const res = await request(server)
        .get('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toContainEqual(catWithBreed);
    });

    it('should get a cat by id', async () => {
      const res = await request(server)
        .get(`/cat/${cat.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toEqual(catWithBreed);
    });

    it('should update a cat', async () => {
      const { body: updatedCat } = await request(server)
        .put(`/cat/${cat.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inputCat,
          name: 'Alfred 2',
          age: 4,
        });

      expect(updatedCat.name).toBe('Alfred 2');
      expect(updatedCat.age).toBe(4);

      const findCatRes = await request(server)
        .get(`/cat/${cat.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const updatedCatWithBreed = { ...updatedCat, breed };
      expect(findCatRes.body).toEqual(updatedCatWithBreed);

      // expect(events).toContainEqual({
      //   event: 'data.crud',
      //   data: {
      //     action: 'update',
      //     model: 'cat',
      //     cat: updatedCat,
      //   },
      // });
    });
  });

  describe('Commentaire', () => {
    let cat: CatResponseDto;
    let breed: BreedResponseDto;

    beforeAll(async () => {
      const resBreed = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inputBreed)
        .expect(201);
      breed = resBreed.body;
      const res = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .expect(201);
      cat = res.body;
    });

    it('should create a commentaire', async () => {
      console.log('cat', cat);
      const res = await request(server)
        .post('/commentaire')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a comment',
          catId: cat.id,
        })
        .expect(201);

      expect(res.body.content).toBe('This is a comment');
      expect(res.body.catId).toBe(cat.id);
      expect(res.body.id).toBeDefined();
    });
  });
});
