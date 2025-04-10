import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersService} from '@/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/auth/auth.guard';
import { UsersModule } from '@/users/users.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([UsersEntity]),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('TOKEN_SECRET'),
          signOptions: {expiresIn: '7d'}
        })
      }),
      forwardRef(() => UsersModule)
    ],
    controllers: [AuthController],
    providers: [
      AuthService,
      { provide: APP_GUARD, useClass: AuthGuard },
    ]
})
export class AuthModule {}
