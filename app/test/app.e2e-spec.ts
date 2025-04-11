import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Res } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule, registerGlobals } from '@/app.module';
import { CreateBreedDto } from '@/breed/dtos/create-breed';
import { CreateCatDto } from '@/cat/dtos';
import { RandomGuard } from '@/lib/random.guard';
import { BreedResponseDto } from '@/breed/dtos';
import { CatResponseDto } from '@/cat/dtos';
import { ResponseUserDto } from '@/users/dto/response-user.dto';
import { Socket, io } from 'socket.io-client';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { CreateCommentaryDto } from '@/commentary/dto/create-commentary.dto';
import { wait } from '@/lib/utils';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: ReturnType<INestApplication['getHttpServer']>;
  let ioClient: Socket;
  let events: { event: string; data: any }[] = [];

  const inputBreed: CreateBreedDto = {
    name: 'Fluffy',
    description: 'A fluffy breed',
  };

  const inputUser: CreateUserDto = {
    name: 'John Doe',
    email: 'lucas3@gmail.com',
    username: 'jhon',
    description: 'A user',
    password: 'jhon'
  };

  const inputCommentary: CreateCommentaryDto = {
    text: 'A commentary',
    cat: '1',
  };

  const inputCat: CreateCatDto = {
    name: 'Alfred',
    age: 1,
    breedId: '',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(RandomGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    registerGlobals(app);

    await app.init();

    server = app.getHttpServer();

    app.listen(9001);
    ioClient = io('http://localhost:9001', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
    ioClient.connect();
    ioClient.emit('subscribe', { name: 'test' });
    ioClient.onAny((event, data) => {
      events.push({ event, data });
    });
  });

  afterEach(async () => {
    events = [];
  });

  afterAll(async () => {
    console.log('[TEST CLEANUP] User to delete:', user);
    if (user) {
      await request(server).delete(`/users/delete/${user.id}`).expect(200);
    }
  });

  afterAll(async () => {
    ioClient.offAny();
    ioClient.disconnect();
    await app.close();
  });

  it('Health check', () => {
    request(server).get('/').expect(200).expect('OK');
  });
  
  let user: ResponseUserDto;
  let jwt: string;

  beforeAll(async () => {
    if (!user) {
    const res = await request(server)
      .post('/users')
      .send(inputUser)
      .expect(201);
    user = res.body;
    }
  });

  beforeAll(async () => {
    if (!jwt) {
      const res = await request(server)
        .post('/auth/login')
        .send({ email: inputUser.email, password: inputUser.password })
        .expect(201);
      jwt = res.body.access_token;
    }
  });



  describe('User', () => {


    it('should create a user', async () => {
      const uniqueEmail = `${Date.now()}@gmail.com`;
      const res = await request(server)
      .post('/users')
      .send({ ...inputUser, email: uniqueEmail })
      .expect(201);

      expect(res.body.name).toBe(inputUser.name);
      expect(res.body.email).toBe(uniqueEmail);
      expect(res.body.username).toBe(inputUser.username);
      expect(res.body.description).toBe(inputUser.description);
      expect(res.body.id).toBeDefined();
      expect(res.body.password).not.toBe(inputUser.password);
      expect(events).toContainEqual({
      event: 'data.crud',
      data: {
        action: 'create',
        model: 'user',
      },
      });

      await request(server).delete(`/users/delete/${res.body.id}`).expect(200);
    });

    it('should rejects wrong inputs', async () => {
      const res = await request(server)
        .post('/users')
        .send({
          name: 'John Doe',
        })
        .expect(400);
      expect(res.body.message).toContain('username should not be empty');
      expect(res.body.message).toContain('username must be a string');
      expect(res.body.message).toContain('email should not be empty');
      expect(res.body.message).toContain('email must be a string');
      expect(res.body.message).toContain('description should not be empty');
      expect(res.body.message).toContain('description must be a string');
      expect(res.body.message).toContain('password should not be empty');
      expect(res.body.message).toContain('password must be a string');
    });

    it('should get all users', async () => {
      const res = await request(server).get('/users').expect(200);
      expect(res.body).toContainEqual({ ...user, commentaries: [] });
    });

    it('should get a user by id', async () => {
      const res = await request(server).get(`/users/${user.id}`).expect(200);
      expect(res.body).toEqual({ ...user, commentaries: [] });
    });


  });


  describe('Breed', () => {
    it('should create a breed', async () => {
      const res = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${jwt}`)
        .send(inputBreed)
        .expect(201);

      expect(res.body.name).toBe(inputBreed.name);
      expect(res.body.description).toBe(inputBreed.description);
      expect(res.body.id).toBeDefined();
      expect(res.body.seed).not.toBeDefined();
      expect(events).toContainEqual({
        event: 'data.crud',
        data: {
          action: 'create',
          model: 'breed',
          breed: res.body,
        },
      });
    });

    it('should rejects wrong inputs', async () => {
      await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          description: 'A fluffy breed',
        })
        .expect(400);

      await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          name: '',
        })
        .expect(400);
    });

    it('should get all breeds', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${jwt}`)
        .send(inputBreed)
        .expect(201);
        const res = await request(server)
        .get('/breed')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);
      expect(res.body).toContainEqual(createdBreed);
    });

    it('should get all cats of a breed', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${jwt}`)
        .send(inputBreed)
        .expect(201);

      const { body: createdCat } = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);
      const { body: createdCat2 } = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);

      const res = await request(server)
        .get(`/breed/${createdBreed.id}/cats`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(res.body).toEqual([createdCat, createdCat2]);
    });
  });

  describe('Cat', () => {
    let breed: BreedResponseDto;
    let cat: CatResponseDto;

    beforeAll(async () => {
      console.log('[TEST CLEANUP] user', user.id);

      const res = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${jwt}`)
        .send(inputBreed)
        .expect(201);
      breed = res.body;
      const catRes = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .expect(201);
      cat = catRes.body;
    });

    it('should create a cat', async () => {
      console.log('[TEST CLEANUP] user 2 ', user.id);
      const res = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .expect(201);

      expect(res.body.name).toBe(inputCat.name);
      expect(res.body.age).toBe(inputCat.age);
      expect(res.body.breedId).toBe(breed.id);
      expect(res.body.id).toBeDefined();
      expect(res.body.color.length).toBe(6);
      expect(events).toContainEqual({
        event: 'data.crud',
        data: {
          action: 'create',
          model: 'cat',
          cat: res.body,
        },
      });
    });

    it('should get all cats', async () => {
      const res = await request(server).get('/cat').set('Authorization', `Bearer ${jwt}`).expect(200);
      const catWithBreed = { ...cat, breed, userId: user.id };
      expect(res.body).toContainEqual(catWithBreed);
    });

    it('should get a cat by id', async () => {
      const res = await request(server).get(`/cat/${cat.id}`).set('Authorization', `Bearer ${jwt}`).expect(200);
      const catWithBreed = { ...cat, breed, userId: user.id };
      expect(res.body).toEqual(catWithBreed);
    });

    it('should update a cat', async () => {
      const { body: updatedCat } = await request(server)
        .put(`/cat/${cat.id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({
          ...inputCat,
          name: 'Alfred 2',
          age: 4,
        });

      expect(updatedCat.name).toBe('Alfred 2');
      expect(updatedCat.age).toBe(4);

      const findCatRes = await request(server)
        .get(`/cat/${cat.id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      const updatedCatWithBreed = { ...updatedCat, breed };
      expect(findCatRes.body).toEqual(updatedCatWithBreed);

      expect(events).toContainEqual({
        event: 'data.crud',
        data: {
          action: 'update',
          model: 'cat',
          cat: updatedCat,
        },
      });
    });
  });
});
