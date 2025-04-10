import { Module, forwardRef } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatEntity } from './cat.entity';
import { BreedEntity } from '@/breed/breed.entity';
import { UserEntity } from '@/users/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BreedModule } from '@/breed/breed.module';
import { redisConfig } from '@/config';
import { UsersModule } from '@/users/users.module';
@Module({
  controllers: [CatController],
  providers: [CatService],
  imports: [
    TypeOrmModule.forFeature([CatEntity, BreedEntity,UserEntity,]),
    
    ClientsModule.register([
      {
        name: 'COLORS_SERVICE',
        transport: Transport.REDIS,
        options: redisConfig,
      },
    ]),

    UsersModule,

    forwardRef(() => BreedModule),
  ],
  
  exports: [CatService],
})
export class CatModule {}
