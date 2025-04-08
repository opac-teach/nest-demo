import { Module, forwardRef } from '@nestjs/common';
import { userController } from './user.controller';
import { userService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './user.entity';
import { BreedEntity } from '@/breed/breed.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BreedModule } from '@/breed/breed.module';
import { redisConfig } from '@/config';
import { CatModule } from '@/cat/cat.module';
@Module({
  controllers: [userController],
  providers: [userService],
  imports: [
    TypeOrmModule.forFeature([userEntity, BreedEntity]),
    ClientsModule.register([
      {
        name: 'COLORS_SERVICE',
        transport: Transport.REDIS,
        options: redisConfig,
      },
    ]),
    forwardRef(() => BreedModule),
    CatModule
  ],
  exports: [userService],
})
export class userModule {}
