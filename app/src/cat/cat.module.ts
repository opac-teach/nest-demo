import { Module, forwardRef } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatEntity } from './cat.entity';
import { BreedEntity } from '@/breed/breed.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BreedModule } from '@/breed/breed.module';
import { redisConfig } from '@/config';
import { AuthModule } from '@/auth/auth.module';
import { UserService } from '@/user/user.service';
import { UserEntity } from '@/user/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { CommentsModule } from '@/comments/comments.module';
@Module({
  controllers: [CatController],
  providers: [CatService, UserService],
  imports: [
    TypeOrmModule.forFeature([CatEntity, BreedEntity, UserEntity]),
    AuthModule,
    CommentsModule,
    UserModule,
    ClientsModule.register([
      {
        name: 'COLORS_SERVICE',
        transport: Transport.REDIS,
        options: redisConfig,
      },
    ]),
    forwardRef(() => BreedModule),
  ],
  exports: [CatService, UserService],
})
export class CatModule {}
