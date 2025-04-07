import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatEntity } from '@/cat/cat.entity';
import { CatModule } from '@/cat/cat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CatEntity]),
    forwardRef(() => CatModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
