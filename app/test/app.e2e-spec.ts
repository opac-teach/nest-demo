import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule, registerGlobals } from '@/app.module';
import { CreateBreedDto } from '@/breed/dtos/create-breed';
import { CreateCatDto, CreateKittenDto } from '@/cat/dtos';
import { BreedResponseDto } from '@/breed/dtos';
import { CatResponseDto } from '@/cat/dtos';
import { Socket, io } from 'socket.io-client';
import { CreateUserDto } from '@/user/dtos';
import { CommentaireResponseDto } from '@/commentaire/dtos';
import { UserResponseDto } from '@/user/dtos';
import { CrossRequestResponseDto } from '@/cross-request/dtos';
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: ReturnType<INestApplication['getHttpServer']>;
  let ioClient: Socket;
  let authToken: string | undefined;
  // let events: { event: string; data: any }[] = [];

  let user1: UserResponseDto;

  const inputBreed: CreateBreedDto = {
    name: 'Fluffy',
    description: 'A fluffy breed',
  };

  const inputBreed2: CreateBreedDto = {
    name: 'Fluffy 2',
    description: 'A fluffy breed 2',
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

  const inputUser2: CreateUserDto = {
    email: 'test2@test.com',
    password: 'password',
    name: 'Test 2',
  };

  const kittenInput: CreateKittenDto = {
    name: 'Kitten',
    parent1Id: '',
    parent2Id: '',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
      // on vérifie si l'user est déjà créé, sinon on le créé
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
      const res = await request(server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.email).toBe(inputUser.email);
      user1 = res.body;
    });
  });

  describe('User', () => {
    it('should get one user', async () => {
      console.log('useeeeeeeeeeer1', user1);
      const res = await request(server)
        .get(`/user/${user1.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.email).toBe(inputUser.email);
    });

    it('should update a user', async () => {
      const res = await request(server)
        .put(`/user/${user1.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test 2' })
        .expect(200);
      expect(res.body.name).toEqual('Test 2');
    });
  });

  describe('Breed', () => {
    let breed: BreedResponseDto;
    it('should create a breed', async () => {
      const res = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inputBreed)
        .expect(201);
      breed = res.body;

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

    it('should delete a breed', async () => {
      const res = await request(server)
        .delete(`/breed/${breed.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toBe('La race a bien été supprimée.');
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

  describe('Cross-cat', () => {
    let catofUser1: CatResponseDto;
    let catofUser2: CatResponseDto;
    let breed: BreedResponseDto;
    let crossRequest: CrossRequestResponseDto[];

    beforeAll(async () => {
      // on crée le deuxième user si il n'existe pas
      const allUsers = await request(server).get('/user').expect(200);
      const user = allUsers.body.find(
        (user) => user.email === inputUser2.email,
      );
      if (!user) {
        const res = await request(server)
          .post('/auth/register')
          .send(inputUser2)
          .expect(201);

        expect(res.body.id).toBeDefined();
        expect(res.body.email).toBe(inputUser2.email);
        expect(res.body.name).toBe(inputUser2.name);
      }

      // login avec le deuxième user
      const loginRes = await request(server)
        .post('/auth/login')
        .send({ email: inputUser2.email, password: inputUser2.password })
        .expect(200);

      expect(loginRes.body.message).toBe(`Bienvenue ${inputUser2.name} !`);
      expect(loginRes.body.token).toBeDefined();
      authToken = loginRes.body.token;

      // création de la deuxième race
      const resBreed = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inputBreed2)
        .expect(201);
      breed = resBreed.body;

      // création du chat du deuxième user
      const resCat = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...inputCat, breedId: breed.id })
        .expect(201);
      catofUser2 = resCat.body;

      // reconnecte le premier user
      const loginRes2 = await request(server)
        .post('/auth/login')
        .send({ email: inputUser.email, password: inputUser.password })
        .expect(200);
      authToken = loginRes2.body.token;

      const resCat2 = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...inputCat, breedId: breed.id })
        .expect(201);
      catofUser1 = resCat2.body;
    });

    it('should create a cross-cat', async () => {
      const res = await request(server)
        .post('/cross-request')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ senderCatId: catofUser1.id, receiverCatId: catofUser2.id })
        .expect(201);

      expect(res.body.message).toBe(
        'Demande de croisement envoyée avec succès !',
      );
    });

    it('should connect with second user', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({ email: inputUser2.email, password: inputUser2.password })
        .expect(200);

      expect(res.body.message).toBe(`Bienvenue ${inputUser2.name} !`);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    it('should get all cross-requests', async () => {
      const res = await request(server)
        .get('/cross-request')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toBeDefined();
      crossRequest = res.body;
    });

    it('should answer to a cross-request', async () => {
      const res = await request(server)
        .post(`/cross-request/${crossRequest[0].id}/answer?accept=true`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(res.body.message).toBe('La requête a bien été acceptée !');
    });

    it('should connect with first user to start a cross with this cat and the second cat of user', async () => {
      const res = await request(server)
        .post('/cat/kitten')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...kittenInput,
          parent1Id: catofUser1.id,
          parent2Id: catofUser2.id,
        })
        .expect(201);

      expect(res.body.name).toBe(kittenInput.name);
      expect(res.body.id).toBeDefined();
      expect(res.body.age).toBe(1);
    });
  });

  describe('Commentaire', () => {
    let cat: CatResponseDto;
    let breed: BreedResponseDto;
    let commentaire: CommentaireResponseDto;

    beforeAll(async () => {
      // on se connecte avec user 1
      const loginRes = await request(server)
        .post('/auth/login')
        .send({ email: inputUser.email, password: inputUser.password })
        .expect(200);
      authToken = loginRes.body.token;

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

      commentaire = res.body;

      expect(res.body.content).toBe('This is a comment');
      expect(res.body.catId).toBe(cat.id);
      expect(res.body.id).toBeDefined();
    });

    it('should update a commentaire', async () => {
      const res = await request(server)
        .put(`/commentaire/${commentaire.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'This is an updated comment' })
        .expect(200);

      expect(res.body.content).toBe('This is an updated comment');
      expect(res.body.id).toBe(commentaire.id);
      expect(res.body.catId).toBe(cat.id);
      commentaire = res.body;
    });

    it('should get all commentaires of a cat', async () => {
      const res = await request(server)
        .get(`/cat/${cat.id}/commentaires`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toContainEqual(commentaire);
    });

    it('should get info of a user', async () => {
      const res = await request(server)
        .get(`/user/${user1.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      user1 = res.body;
    });

    it('should get all commentaires of a user', async () => {
      const res = await request(server)
        .get(`/user/${user1.id}/commentaires`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).toContainEqual(commentaire);
    });

    it('should delete user', async () => {
      const res = await request(server)
        .delete(`/user`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).toBe('Votre compte a bien été supprimé.');
    });

    it("shouldn't get commentaire after user deletion", async () => {
      const res = await request(server)
        .get(`/commentaire/${commentaire.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body).not.toContainEqual(commentaire);
    });
  });
});
