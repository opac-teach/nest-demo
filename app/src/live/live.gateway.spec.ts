import { Test, TestingModule } from '@nestjs/testing';
import { LiveGateway } from './live.gateway';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataCrudEvent, PublicDataCrudEvent } from './dtos';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { wait } from '@/lib/utils';

describe('LiveGateway', () => {
  let app: INestApplication;
  let gateway: LiveGateway;
  let ioClient: Socket;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveGateway, EventEmitter2],
      imports: [EventEmitterModule.forRoot()],
    }).compile();

    app = module.createNestApplication();
    gateway = module.get<LiveGateway>(LiveGateway);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    app.listen(9000);

    ioClient = io('http://localhost:9000', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  });

  beforeEach(async () => {
    ioClient.connect();
  });

  afterEach(async () => {
    ioClient.disconnect();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit "hello" on "hello"', async () => {
    await new Promise<void>((resolve) => {
      ioClient.emit('hello', { name: 'John' }, (data) => {
        expect(data).toEqual({ message: 'Hello John' });
        resolve();
      });
    });
  });

  it('should subscribe', async () => {
    await new Promise<void>((resolve, reject) => {
      ioClient.emit('subscribe', { name: 'John' }, async (answer) => {
        try {
          expect(answer.clientId).toBeDefined();
          expect(gateway.subscribedClients.size).toBe(1);
          expect(gateway.subscribedClients.values().next().value.id).toBe(
            answer.clientId,
          );
          ioClient.disconnect();
          await wait(100);
          expect(gateway.subscribedClients.size).toBe(0);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('should unsubscribe', async () => {
    expect(gateway.subscribedClients.size).toBe(0);
    await new Promise<void>((resolve, reject) => {
      ioClient.emit('subscribe', { name: 'John' }, async (answer) => {
        try {
          expect(gateway.subscribedClients.size).toBe(1);
          ioClient.emit('unsubscribe');
          await wait(100);
          expect(gateway.subscribedClients.size).toBe(0);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('should emit "data.crud" on "data.crud" event', async () => {
    ioClient.emit('subscribe', { name: 'John' });
    const dataCrudEvent: DataCrudEvent = {
      action: 'create',
      model: 'cat',
      cat: {
        id: '1',
        name: 'John',
        age: 1,
        created: new Date(),
        updated: new Date(),
        color: 'white',
      },
    };

    await wait(100);
    eventEmitter.emit('data.crud', dataCrudEvent);

    await new Promise<void>((resolve, reject) => {
      ioClient.on('data.crud', (data) => {
        if (data.model !== 'cat') return;
        try {
          const expected = {
            action: 'create',
            model: 'cat',
            cat: {
              id: '1',
              name: 'John',
              age: 1,
              created: dataCrudEvent.cat?.created.toISOString(),
              updated: dataCrudEvent.cat?.updated.toISOString(),
              color: 'white',
            },
          };
          expect(data).toEqual(expected);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('should serialize data on "data.crud" event', async () => {
    ioClient.emit('subscribe', { name: 'John' });
    const dataCrudEvent: DataCrudEvent = {
      action: 'create',
      model: 'breed',
      breed: {
        id: '1',
        name: 'John',
        description: 'A fluffy breed',
      },
    };

    await wait(100);
    eventEmitter.emit('data.crud', dataCrudEvent);

    await new Promise<void>((resolve, reject) => {
      ioClient.on('data.crud', (data) => {
        try {
          const expected: PublicDataCrudEvent = {
            action: 'create',
            model: 'breed',
            breed: {
              id: '1',
              name: 'John',
              description: 'A fluffy breed',
            },
          };
          expect(data).toEqual(expected);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
});
