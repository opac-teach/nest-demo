import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import {CommentEntity} from "@/comment/comment.entity";
import {CatEntity} from "@/cat/cat.entity";
import {UserEntity} from "@/user/user.entity";
import {Repository} from "typeorm";
import {getRepositoryToken} from "@nestjs/typeorm";
import {mockTheRest} from "@/lib/tests";
import {CreateCommentDto, UpdateCommentDto} from "@/comment/dto";
import {CatService} from "@/cat/cat.service";
import {NotFoundException} from "@nestjs/common";
import {instanceToInstance} from "class-transformer";

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<CommentEntity>
  let catService: CatService

  const mockUser: UserEntity = {
    id: '1',
    name: 'Antoine Dupont',
    description: 'Joueur de rugby.',
    email: 'toto@gmail.com',
    password: 'Antoine',
    created: new Date(),
    updated: new Date(),
    cats: [],
    comments: [],
    updateTimestamp: () => new Date(),
    hashPassword: jest.fn()
  };

  const mockCat: CatEntity = {
    id: '1',
    name: 'Fluffy',
    age: 3,
    breedId: '1',
    created: new Date(),
    updated: new Date(),
    color: '11BB22',
    updateTimestamp: jest.fn(),
    ownerId: mockUser.id,
    owner: mockUser,
    comments: []
  };

  const mockComment: CommentEntity = {
    id: '1',
    title: 'CommentTest',
    text: 'Jolie chaton',
    catId: mockCat.id,
    authorId: mockUser.id,
    created: new Date(),
    updated: new Date(),
    updateTimestamp: () => new Date(),
    author: mockUser,
    cat: mockCat
  }

  const mockCommentRepository: Partial<Repository<CommentEntity>> = {
    create: jest.fn().mockImplementation(c => c),
    find: jest.fn().mockResolvedValue([mockComment]),
    findOne: jest.fn().mockResolvedValue(mockComment),
    save: jest.fn().mockResolvedValue(mockComment),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          CommentService,
          CatService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository
        }
      ],
    })
        .useMocker(mockTheRest)
        .compile();

    service = module.get<CommentService>(CommentService);
    commentRepository = module.get<Repository<CommentEntity>>(
        getRepositoryToken(CommentEntity)
    )
    catService = module.get<CatService>(CatService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of comment', async (): Promise<void> => {
      const result: CommentEntity[] = await service.findAll()
      expect(result).toEqual([mockComment])
      expect(mockCommentRepository.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single comment', async (): Promise<void> => {
      const result: CommentEntity = await service.findOne('1')
      expect(result).toEqual(mockComment)
    })
  })

  describe('create', () => {
    const newComment: CreateCommentDto = {
      title: 'CommentTest',
      text: 'Jolie chaton',
      catId: mockCat.id
    }

    it('should create a new comment', async (): Promise<void> => {
      jest.spyOn(catService, 'findOne').mockResolvedValue(mockCat)

      const result: CommentEntity = await service.create(newComment, mockUser.id)
      expect(mockCommentRepository.save).toHaveBeenCalledWith({
        ...newComment,
        authorId: mockUser.id
      })
      expect(result).toEqual(mockComment)
    })
  })

  describe('update', () => {
    it('should update a comment', async (): Promise<void> => {
      const updateComment: UpdateCommentDto = { title: 'Comment updated'}
      const updatedComment: CommentEntity = instanceToInstance(mockComment)
      Object.assign(updatedComment, updateComment)

      jest.spyOn(service, 'findOne').mockResolvedValue(updatedComment)

      const result: CommentEntity = await service.update(mockComment.id, updateComment)
      expect(result).toEqual(updatedComment)
      expect(mockCommentRepository.update).toHaveBeenCalledWith(
          mockComment.id,
          updateComment
      )
    })
  })

  describe('remove', () => {
    it('should delete a comment and return a confirmation message', async (): Promise<void> => {
      const result = await service.remove(mockComment.id);
      expect(mockCommentRepository.delete).toHaveBeenCalledWith(mockComment.id);
      expect(result).toBe('Commentaire supprimé.');
    });
  });

});
