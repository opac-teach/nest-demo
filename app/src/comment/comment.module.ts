import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from './entities/comment.entity';
import { CatEntity } from '@/cat/cat.entity';
import { UserEntity } from '@/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [TypeOrmModule.forFeature([CommentEntity, CatEntity, UserEntity])],
  exports: [CommentService],
})
export class CommentModule {}
