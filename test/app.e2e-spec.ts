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
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const inputBreed: CreateBreedDto = {
    name: 'Fluffy',
    description: 'A fluffy breed',
  };

  const inputCat: CreateCatDto = {
    name: 'Alfred',
    age: 1,
    breedId: '',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(RandomGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    registerGlobals(app);

    await app.init();
  });

  it('Health check', () => {
    request(app.getHttpServer()).get('/').expect(200).expect('OK');
  });

  describe('Breed', () => {
    it('should create a breed', async () => {
      const res = await request(app.getHttpServer())
        .post('/breed')
        .send(inputBreed)
        .expect(201);

      expect(res.body.name).toBe(inputBreed.name);
      expect(res.body.description).toBe(inputBreed.description);
      expect(res.body.id).toBeDefined();
      expect(res.body.seed).not.toBeDefined();
    });

    it('should rejects wrong inputs', async () => {
      await request(app.getHttpServer())
        .post('/breed')
        .send({
          description: 'A fluffy breed',
        })
        .expect(400);
      await request(app.getHttpServer())
        .post('/breed')
        .send({
          name: '',
        })
        .expect(400);
    });

    it('should get all breeds', async () => {
      const { body: createdBreed } = await request(app.getHttpServer())
        .post('/breed')
        .send(inputBreed)
        .expect(201);
      const res = await request(app.getHttpServer()).get('/breed').expect(200);
      expect(res.body).toContainEqual(createdBreed);
    });

    it('should get all cats of a breed', async () => {
      const { body: createdBreed } = await request(app.getHttpServer())
        .post('/breed')
        .send(inputBreed)
        .expect(201);

      const { body: createdCat } = await request(app.getHttpServer())
        .post('/cat')
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);
      const { body: createdCat2 } = await request(app.getHttpServer())
        .post('/cat')
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);

      const res = await request(app.getHttpServer())
        .get(`/breed/${createdBreed.id}/cats`)
        .expect(200);

      expect(res.body).toEqual([createdCat, createdCat2]);
    });
  });

  describe('Cat', () => {
    let breed: BreedResponseDto;
    let cat: CatResponseDto;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/breed')
        .send(inputBreed)
        .expect(201);
      breed = res.body;
      const catRes = await request(app.getHttpServer())
        .post('/cat')
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .expect(201);
      cat = catRes.body;
    });

    it('should create a cat', async () => {
      const res = await request(app.getHttpServer())
        .post('/cat')
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
    });

    it('should get all cats', async () => {
      const res = await request(app.getHttpServer()).get('/cat').expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toContainEqual(catWithBreed);
    });

    it('should get a cat by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/cat/${cat.id}`)
        .expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toEqual(catWithBreed);
    });

    it('should update a cat', async () => {
      const { body: updatedCat } = await request(app.getHttpServer())
        .put(`/cat/${cat.id}`)
        .send({
          ...inputCat,
          name: 'Alfred 2',
          age: 4,
        });

      expect(updatedCat.name).toBe('Alfred 2');
      expect(updatedCat.age).toBe(4);

      const findCatRes = await request(app.getHttpServer())
        .get(`/cat/${cat.id}`)
        .expect(200);

      const updatedCatWithBreed = { ...updatedCat, breed };
      expect(findCatRes.body).toEqual(updatedCatWithBreed);
    });
  });
});
