import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  DataCrudEvent,
  HelloRequestDto,
  HelloResponseDto,
  PublicDataCrudEvent,
  SubscribeRequestDto,
  SubscribeResponseDto,
} from './dtos';
import { OnEvent } from '@nestjs/event-emitter';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@WebSocketGateway()
export class LiveGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(LiveGateway.name);

  @WebSocketServer() server: Server;

  subscribedClients: Map<string, Socket> = new Map();

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
    this.subscribedClients.delete(client.id);
  }

  @SubscribeMessage('hello')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: HelloRequestDto,
  ): HelloResponseDto {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);

    return {
      message: `Hello ${data.name}`,
    };
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SubscribeRequestDto,
  ): SubscribeResponseDto {
    this.logger.log(`Subscribe request received from client id: ${client.id}`);

    this.subscribedClients.set(client.id, client);

    return {
      clientId: client.id,
    };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket): SubscribeResponseDto {
    this.logger.log(
      `Unsubscribe request received from client id: ${client.id}`,
    );

    this.subscribedClients.delete(client.id);

    return {
      clientId: client.id,
    };
  }

  @OnEvent('data.crud')
  handleDataCrud(payload: DataCrudEvent) {
    this.logger.log(`Data crud event received`);
    this.logger.debug(`Payload: ${payload}`);

    const publicPayload = instanceToPlain(
      plainToInstance(PublicDataCrudEvent, payload as any),
      { excludeExtraneousValues: true },
    );

    this.subscribedClients.forEach((client) => {
      client.emit('data.crud', publicPayload);
    });
  }
}
