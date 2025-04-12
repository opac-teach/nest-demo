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
import {CreateUserDto, UserResponseDto} from "@/user/dto";
import {CommentResponseDto, CreateCommentDto} from "@/comment/dto";

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let server: ReturnType<INestApplication['getHttpServer']>;
  let ioClient: Socket;
  let events: { event: string; data: any }[] = [];
  let token: string
  let tokenHacker: string

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
    name: 'John Doe',
    description: 'je suis fan de chats.',
    email: 'matteo@gmail.com',
    password: 'Matteo1234@'
  }

  const inputUserHacker: CreateUserDto = {
    name: 'hack man',
    description: 'je suis fan de hack.',
    email: 'hack@gmail.com',
    password: 'Hack1234@'
  }

  const inputComment: CreateCommentDto = {
    title: 'First comment',
    text: 'Jolie chaton',
    catId: ''
  }

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

    const loginResponseHacker = await request(server)
        .post('/auth/login')
        .send({
          username: inputUserHacker.email,
          password: inputUserHacker.password,
        })
        .expect(200);
    expect(loginResponseHacker.body.access_token).toEqual(expect.any(String));
    tokenHacker = loginResponseHacker.body.access_token;
    await request(server)
        .post('/auth/register')
        .send({
          ...inputUser
        })

    const loginResponse = await request(server)
        .post('/auth/login')
        .send({
          username: inputUser.email,
          password: inputUser.password,
        })
        .expect(200);
    expect(loginResponse.body.access_token).toEqual(expect.any(String));
    token = loginResponse.body.access_token;
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

  describe('Breed', () => {
    it('should create a breed', async () => {
      const res = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'A fluffy breed',
        })
        .expect(400);
      await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
        })
        .expect(400);
    });

    it('should get all breeds', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${token}`)
        .send(inputBreed)
        .expect(201);
      const res = await request(server).get('/breed').expect(200);
      expect(res.body).toContainEqual(createdBreed);
    });

    it('should get all cats of a breed', async () => {
      const { body: createdBreed } = await request(server)
        .post('/breed')
        .set('Authorization', `Bearer ${token}`)
        .send(inputBreed)
        .expect(201);

      const { body: createdCat } = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...inputCat,
          breedId: createdBreed.id,
        })
        .expect(201);
      const { body: createdCat2 } = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send(inputBreed)
        .expect(201);
      breed = res.body;
      const catRes = await request(server)
        .post('/cat')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...inputCat,
          breedId: breed.id,
        })
        .expect(201);

      expect(res.body.name).toBe(inputCat.name);
      expect(res.body.age).toBe(inputCat.age);
      expect(res.body.id).toBeDefined();
      expect(res.body.color.length).toBe(6);
      expect(events).toContainEqual({
        event: 'data.crud',
        data: expect.objectContaining({
          action: 'create',
          model: 'cat',
          cat: expect.objectContaining({
            name: inputCat.name,
            age: inputCat.age,
            breedId: breed.id,
          }),
        }),
      });
    });

    it('should get all cats', async () => {
      const res = await request(server).get('/cat').expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: cat.name,
            age: cat.age,
            color: cat.color,
            breedId: cat.breedId,
            breed: expect.objectContaining({
              id: breed.id,
              name: breed.name,
              description: breed.description,
            }),
          }),
        ])
      );
    });

    it('should get a cat by id', async () => {
      const res = await request(server).get(`/cat/${cat.id}`).expect(200);
      const catWithBreed = { ...cat, breed };
      expect(res.body).toEqual(expect.objectContaining({
        id: cat.id,
        name: cat.name,
        age: cat.age,
        color: cat.color,
        breedId: cat.breedId,
        breed: expect.objectContaining({
          id: breed.id,
          name: breed.name,
        }),
      }));
    });

    it('should update a cat', async () => {
      const { body: updatedCat } = await request(server)
        .put(`/cat/${cat.id}`)
        .set('Authorization', `Bearer ${token}`)
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

      expect(events).toContainEqual(
          expect.objectContaining({
            event: 'data.crud',
            data: expect.objectContaining({
              action: 'update',
              model: 'cat',
              cat: expect.objectContaining({
                id: updatedCat.id,
                name: updatedCat.name,
                age: updatedCat.age,
                breedId: updatedCat.breedId,
                color: updatedCat.color,
              }),
            }),
          })
      );
    });

    it('should not update a cat : not allowed', async () => {
      const { body: updatedCat } = await request(server)
          .put(`/cat/${cat.id}`)
          .set('Authorization', `Bearer ${tokenHacker}`)
          .send({
            ...inputCat,
            name: 'Alfred 2',
            age: 4,
          })
          .expect(401)
      expect(updatedCat.message).toEqual('You are not authorized to access this cat')
    })
  });

  describe('Comment', (): void => {
    let comment: CommentResponseDto
    let breed: BreedResponseDto;
    let cat: CatResponseDto;

    beforeAll(async (): Promise<void> => {
      const breedRes = await request(server)
          .post('/breed')
          .set('Authorization', `Bearer ${token}`)
          .send(inputBreed)
          .expect(201);
      breed = breedRes.body;
      const catRes = await request(server)
          .post('/cat')
          .set('Authorization', `Bearer ${token}`)
          .send({
            ...inputCat,
            breedId: breed.id,
          })
          .expect(201);
      cat = catRes.body;

      const commentRes = await request(server)
          .post('/comment')
          .set('Authorization', `Bearer ${token}`)
          .send({
            ...inputComment,
            catId: cat.id
          })
          .expect(201)
        comment = commentRes.body
    })

    it('should create a comment', async (): Promise<void> => {
      const res = await request(server)
        .post('/comment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...inputComment,
          catId: cat.id
        })
        .expect(201)

      expect(res.body.title).toBe(inputComment.title);
      expect(res.body.text).toBe(inputComment.text);
      expect(res.body.catId).toBe(cat.id);
      expect(res.body.id).toBeDefined();
    })

    it('should get all comments', async (): Promise<void> => {
      const res = await request(server).get('/comment').expect(200);
      expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: comment.title,
              text: comment.text,
              catId: cat.id
            }),
          ])
      );
    })

    it('should get a comment by id', async (): Promise<void> => {
      const res = await request(server).get(`/comment/${comment.id}`).expect(200);
      expect(res.body).toEqual(expect.objectContaining({
        id: comment.id,
        title: comment.title,
        text: comment.text,
        catId: cat.id
      }));
    })

    it('should not update a comment : not allowed', async (): Promise<void> => {
      const { body: updatedComment } = await request(server)
          .put(`/comment/${comment.id}`)
          .set('Authorization', `Bearer ${tokenHacker}`)
          .send({
            title: 'update comment',
            text: 'modification',
          })
          .expect(401)
      expect(updatedComment.message).toEqual('You are not authorized to access this comment')
    })

    it('should update a comment', async (): Promise<void> => {
      const { body: updatedComment } = await request(server)
          .put(`/comment/${comment.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'update comment',
            text: 'modification',
          })
          .expect(200)

      expect(updatedComment.title).toBe('update comment');
      expect(updatedComment.text).toBe('modification');

      const findCommentRes = await request(server)
          .get(`/comment/${comment.id}`)
          .expect(200);

      expect(findCommentRes.body).toEqual(expect.objectContaining({
        id: comment.id,
        title: 'update comment',
        text: 'modification',
        catId: cat.id,
        authorId: expect.any(String),
        created: expect.any(String),
        updated: expect.any(String),
      }));
    });

    it('should not delete a comment : not allowed', async (): Promise<void> => {
      const res = await request(server)
          .delete(`/comment/${comment.id}`)
          .set('Authorization', `Bearer ${tokenHacker}`)
          .expect(401);
      expect(res.body.message).toEqual('You are not authorized to access this comment');
    })

    it('should delete a comment', async (): Promise<void> => {
      const res = await request(server)
          .delete(`/comment/${comment.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      expect(res.body.message).toEqual('Commentaire supprimé.');
    })
  })

  describe('User', (): void => {
    let user: UserResponseDto

    beforeAll(async (): Promise<void> => {
      const res = await request(server)
          .get('/user/me')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      user = res.body;
    })

    it('should get user connected', async (): Promise<void> => {
      const res = await request(server)
          .get('/user/me')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

      expect(res.body).toEqual(expect.objectContaining({
        id: user.id,
        name: user.name,
        email: user.email,
        description: user.description,
        created: user.created,
        updated: user.updated
      }));
    })

    it('should not update a user : not allowed', async () => {
      const { body: updatedUser } = await request(server)
          .put(`/user/${user.id}`)
          .set('Authorization', `Bearer ${tokenHacker}`)
          .send({
            name: 'Matteo',
            description: 'Nouvelle bio',
          })
          .expect(401)
      expect(updatedUser.message).toEqual('You are not authorized to access this resource')
    })

    it('should update a user', async (): Promise<void> => {
      const { body: updatedUser } = await request(server)
          .put(`/user/${user.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Matteo',
            description: 'Nouvelle bio',
          })
          .expect(200)

      expect(updatedUser.name).toBe('Matteo');
      expect(updatedUser.description).toBe('Nouvelle bio');

      const findUserRes = await request(server)
          .get(`/user/${user.id}`)
          .expect(200);

      expect(findUserRes.body).toEqual(expect.objectContaining({
        id: user.id,
        name: 'Matteo',
        description: 'Nouvelle bio',
        email: user.email,
        created: user.created
      }));
    });

    it('should not delete a user : not allowed', async (): Promise<void> => {
      const res = await request(server)
          .delete(`/user/${user.id}`)
          .set('Authorization', `Bearer ${tokenHacker}`)
          .expect(401);
      expect(res.body.message).toEqual('You are not authorized to access this resource');
    })

    it('should delete a user', async (): Promise<void> => {
      const res = await request(server)
          .delete(`/user/${user.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
      expect(res.body.message).toEqual('Compte supprimé.');
    })
  })
});
