import { forwardRef, Module } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CommentaireController } from './commentaire.controller';
import { CommentaireEntity } from './commentaire.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@/auth/auth.module';

@Module({
  controllers: [CommentaireController],
  providers: [CommentaireService],
  imports: [
    TypeOrmModule.forFeature([CommentaireEntity]),
    forwardRef(() => AuthModule),
    JwtModule,
  ],
  exports: [CommentaireService],
})
export class CommentaireModule {}
