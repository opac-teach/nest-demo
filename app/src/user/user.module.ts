import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "@/user/user.entity";
import {CatEntity} from "@/cat/cat.entity";
import {CatModule} from "@/cat/cat.module";

@Module({
  controllers: [UserController],
  providers: [
      UserService
  ],
  imports: [
      TypeOrmModule.forFeature([UserEntity, CatEntity]),
      forwardRef(() => CatModule)
  ],
    exports: [UserService]
})
export class UserModule {}
