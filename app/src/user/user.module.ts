import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CatEntity } from '@/cat/cat.entity';
import { CatModule } from '@/cat/cat.module';
import { CommentEntity } from '@/comment/entities/comment.entity';
import { CommentModule } from '@/comment/comment.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, CatEntity, CommentEntity]),
    forwardRef(() => CatModule),
    forwardRef(() => CommentModule),
  ],
  exports: [UserService],
})
export class UserModule {}
