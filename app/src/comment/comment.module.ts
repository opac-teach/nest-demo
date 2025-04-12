import {forwardRef, Module} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CommentEntity} from "@/comment/comment.entity";
import {CatEntity} from "@/cat/cat.entity";
import {UserEntity} from "@/user/user.entity";
import {CatModule} from "@/cat/cat.module";
import {UserModule} from "@/user/user.module";

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
      TypeOrmModule.forFeature([CommentEntity, CatEntity, UserEntity]),
      forwardRef(() => CatModule),
      forwardRef(() => UserModule)
  ]
})
export class CommentModule {}
