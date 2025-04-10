import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { CommentEntity } from './comments.entity';
import {AuthModule} from "@/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), forwardRef(() => AuthModule)],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentsModule {}