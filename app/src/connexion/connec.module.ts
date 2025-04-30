import { Module } from '@nestjs/common';
import { ConnecService } from './connec.service';
import { ConnecController } from './connec.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './connec.constants';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule, 
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ConnecService, JwtStrategy],
  controllers: [ConnecController],
})
export class ConnecModule {}
