import { Module } from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CommentaryController } from './commentary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/users/user.entity';
import { CatEntity } from '@/cat/cat.entity';
import { CommentaryEntity } from './commentary.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([CommentaryEntity, UserEntity, CatEntity ]),
    ],
  controllers: [CommentaryController],
  providers: [CommentaryService],
  exports: [CommentaryService],
})
export class CommentaryModule {}
