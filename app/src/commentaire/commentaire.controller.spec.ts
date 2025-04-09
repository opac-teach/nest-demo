import { Test, TestingModule } from '@nestjs/testing';
import { CommentaireController } from './commentaire.controller';
import { CommentaireService } from './commentaire.service';
import { mockTheRest } from '@/lib/tests';

describe('CommentaireController', () => {
  let controller: CommentaireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentaireController],
      providers: [CommentaireService],
    })
      .useMocker(mockTheRest)
      .compile();

    controller = module.get<CommentaireController>(CommentaireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
