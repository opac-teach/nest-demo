import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import {mockTheRest} from "@/lib/tests";

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService],
    })
        .useMocker(mockTheRest)
        .compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
