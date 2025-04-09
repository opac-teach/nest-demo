import { Test, TestingModule } from '@nestjs/testing';
import { CommentaireService } from './commentaire.service';
import { mockTheRest } from '@/lib/tests';

describe('CommentaireService', () => {
  let service: CommentaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentaireService],
    })
      .useMocker(mockTheRest)
      .compile();

    service = module.get<CommentaireService>(CommentaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
