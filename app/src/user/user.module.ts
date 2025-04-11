import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/user/entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { redisConfig } from '@/config';
import { CommentsModule } from '@/comments/comments.module';
import { CommentEntity } from '@/comments/entities/comment.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, CommentEntity]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.REDIS,
        options: redisConfig,
      },
    ]),
    forwardRef(() => CommentsModule),
  ],
})
export class UserModule {}
