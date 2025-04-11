import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule, registerGlobals } from '@/app.module';
import { CreateBreedDto } from '@/breed/dtos/create-breed';
import { CreateCatDto } from '@/cat/dtos';
import { RandomGuard } from '@/lib/random.guard';
import { BreedResponseDto } from '@/breed/dtos';
import { CatResponseDto } from '@/cat/dtos';
import { Socket, io } from 'socket.io-client';
import { wait } from '@/lib/utils';
import { UserEntity } from '@/users/users.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: ReturnType<INestApplication['getHttpServer']>;
  let ioClient: Socket;
  let events: { event: string; data: any }[] = [];
  let userId : string;
  let tockenJwt : string;
  const inputBreed: CreateBreedDto = {
    name: 'Fluffy',
    description: 'A fluffy breed',
  };

  const inputCat: CreateCatDto = {
    name: 'agga',
    age: 1,
    breedId: '',
  };

  function makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
  }

  const inputUser: Partial<UserEntity> = {
    name: makeid(8),
    password: 'testpassword',
    description: 'A new user',
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
    ioClient.offAny();
    ioClient.disconnect();
    await app.close();
  });

  it('Health check', () => {
    request(server).get('/').expect(200).expect('OK');
  });

  describe('User', () => {
    it('should create a user', async () => {
      const res = await request(server)
        .post('/users')
        .send(inputUser)
        .expect(201);

      expect(res.body.name).toBe(inputUser.name);
      expect(res.body.description).toBe(inputUser.description);
      expect(res.body.id).toBeDefined();
      userId = res.body.id;
    });

    const auth = {
      name: inputUser.name,
      password: inputUser.password,
    };

    it('login', async () => {
      const res = await request(server).post('/auth/login').send(auth).expect(200);
      expect(res.body.access_token).toBeDefined()

      tockenJwt = res.body.access_token;
    });

    it('should get all users', async () => {
      const res = await request(server).get('/users').expect(200);
      expect(res.body).toContainEqual(expect.objectContaining({
        name: inputUser.name,
        description: inputUser.description,
      }));
    });

    it('should get a user by id', async () => {
      const res = await request(server).get(`/users/${userId}`).expect(200);
      expect(res.body.id).toBe(userId);
      expect(res.body.name).toBe(inputUser.name);
      expect(res.body.description).toBe(inputUser.description);
    });

    it('should update a user', async () => {
      const updatedData = {
        name: makeid(8),
        password : inputUser.password,
        description: 'Updated description',
      };

      const res = await request(server)
        .put(`/users/${userId}`)
        .send(updatedData)
        .set('Authorization', `Bearer ${tockenJwt}`)
        .expect(200);

      expect(res.body.name).toBe(updatedData.name);
      expect(res.body.description).toBe(updatedData.description);
    });

    it('should delete a user', async () => {
      await request(server)
        .delete(`/users/${userId}`)
        .expect(200);

      await request(server)
        .get(`/users/${userId}`)
        .expect(404); 
    });
  });

  describe('Breed', () => {
    it('should create a breed', async () => {
      const res = await request(server)
        .post('/breed')
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
        .send({
          description: 'A fluffy breed',
        })
        .expect(400);
      await request(server)
        .post('/breed')
        .send({
          name: '',
        })
        .expect(400);
    });

    it('should get all breeds', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .send(inputBreed)
        .expect(201);
      const res = await request(server).get('/breed').expect(200);
      expect(res.body).toContainEqual(createdBreed);
    });

    it('should get all cats of a breed', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .send(inputBreed)
        .expect(201);

      const { body: createdCat } = await request(server)
        .post('/cat')
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);
      const { body: createdCat2 } = await request(server)
        .post('/cat')
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);

      const res = await request(server)
        .get(`/breed/${createdBreed.id}/cats`)
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
        .send(inputBreed)
        .expect(201);
      breed = res.body;
      const catRes = await request(server)
        .post('/cat')
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .set('Authorization', `Bearer ${tockenJwt}`)
        .expect(201);
      cat = catRes.body;
    });

    it('should create a cat', async () => {
      const res = await request(server)
        .post('/cat')
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .set('Authorization', `Bearer ${tockenJwt}`)
        .expect(201);

      const expectedCat = {
        age: inputCat.age,
        breedId: breed.id,
        color: res.body.color,
        name: inputCat.name,
      };

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
          cat: expect.objectContaining({
            age: res.body.age,
            breedId: res.body.breedId,
            color: res.body.color,
            name: res.body.name,
            created: expect.any(String), 
            updated: expect.any(String), 
            id: expect.any(String),      
          }),
        },
      });
    });

    it('should get all cats', async () => {
      const res = await request(server).get('/cat').expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toContainEqual(catWithBreed);
    });

    it('should get a cat by id', async () => {
      const res = await request(server).get(`/cat/${cat.id}`).expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toEqual(catWithBreed);
    });

    it('should update a cat', async () => {
      const { body: updatedCat } = await request(server)
        .put(`/cat/${cat.id}`)
        .send({
          ...inputCat,
          name: 'Alfred 2',
          age: 4,
        });

      expect(updatedCat.name).toBe('Alfred 2');
      expect(updatedCat.age).toBe(4);

      const findCatRes = await request(server)
        .get(`/cat/${cat.id}`)
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
