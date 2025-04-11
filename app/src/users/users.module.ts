import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { CatEntity } from '@/cat/cat.entity';
import { CommentaryEntity } from '@/commentary/commentary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CatEntity, CommentaryEntity]),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
