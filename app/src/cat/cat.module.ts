import { Module, forwardRef } from '@nestjs/common';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatEntity } from './entities/cat.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BreedModule } from '@/breed/breed.module';
import { redisConfig } from '@/config';
import { UsersModule } from '@/users/users.module';

@Module({
  controllers: [CatController],
  providers: [CatService],
  imports: [
    TypeOrmModule.forFeature([CatEntity]),
    ClientsModule.register([
      {
        name: 'COLORS_SERVICE',
        transport: Transport.REDIS,
        options: redisConfig,
      },
    ]),
    forwardRef(() => BreedModule),
    forwardRef(() => UsersModule),

  ],
  exports: [CatService],
})
export class CatModule {}
