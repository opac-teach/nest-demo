import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CatEntity} from "@/cat/cat.entity";
import {UserEntity} from "@/user/user.entity";
import {UserController} from "@/user/user.controller";
import {UserService} from "@/user/user.service";
import {CatModule} from "@/cat/cat.module";

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