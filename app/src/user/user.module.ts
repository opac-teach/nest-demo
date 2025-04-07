import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/user/entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisConfig } from '@/config';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: redisConfig,
      },
    ]),
  ],
})
export class UserModule {}
