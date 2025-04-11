import { Module } from '@nestjs/common';
import { AuthentificationController } from './authentification.controller';
import { AuthentificationService } from './authentification.service';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';




@Module({
    imports: 
    [UsersModule, 
        PassportModule,
        JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
      }),
    ],
    providers:[AuthentificationService,JwtStrategy,LocalStrategy],
    controllers:[AuthentificationController],
   
})
export class AuthentifationModule {}
