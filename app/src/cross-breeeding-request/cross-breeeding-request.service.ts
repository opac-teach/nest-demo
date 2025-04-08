import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrossBreedingRequestEntity } from '@/cross-breeeding-request/entity/crossBreedingRequest.entity';
import { Repository } from 'typeorm';
import { CreateCrossBreedingRequestDto } from '@/cross-breeeding-request/dto/createCrossBreedingRequest.dto';
import { CatService } from '@/cat/cat.service';
import CrossBreedingRequestStatus from '@/lib/crossBreedingRequestStatus.enum';
import { CatEntity } from '@/cat/cat.entity';

@Injectable()
export class CrossBreeedingRequestService {
  constructor(
    @InjectRepository(CrossBreedingRequestEntity)
    private readonly crossBreedingRequestRepository: Repository<CrossBreedingRequestEntity>,
    private readonly catService: CatService,
  ) {}

  public async createCrossBreedingRequest(
    createCrossBreedingRequest: CreateCrossBreedingRequestDto,
    askingUserId: string,
  ): Promise<CrossBreedingRequestEntity> {
    const askingCat = await this.catService.findOne(
      createCrossBreedingRequest.askingCatId,
    );
    if (askingCat.userId !== askingUserId) {
      throw new Error('You cannot request cross breeding with this cat');
    }
    const requestedCat = await this.catService.findOne(
      createCrossBreedingRequest.askedCatId,
    );

    if (!askingCat || !requestedCat) {
      throw new Error('One of the cats does not exist');
    }

    if (askingCat.userId === requestedCat.userId) {
      throw new Error('You cannot request cross breeding with your own cat');
    }

    if (askingCat.breedId === requestedCat.breedId) {
      throw new Error('Both cats are of the same breed');
    }

    const crossBreedingRequest = this.crossBreedingRequestRepository.create({
      askedUserId: requestedCat.userId,
      askedCatId: requestedCat.id,
      askingCatId: askingCat.id,
      askingUserId: askingCat.userId,
      status: CrossBreedingRequestStatus.PENDING,
    });

    return await this.crossBreedingRequestRepository.save(crossBreedingRequest);
  }

  public async acceptCrossBreedingRequest(
    crossBreedingRequestId: number,
    userId: string,
  ): Promise<CatEntity | void> {
    const crossBreedingRequest =
      await this.crossBreedingRequestRepository.findOne({
        where: { id: crossBreedingRequestId, askedUserId: userId },
      });

    if (!crossBreedingRequest) {
      throw new Error('Cross breeding request not found');
    }

    if (crossBreedingRequest.status !== CrossBreedingRequestStatus.PENDING) {
      throw new Error('Cross breeding request is not pending');
    }

    crossBreedingRequest.status = CrossBreedingRequestStatus.ACCEPTED;

    await this.crossBreedingRequestRepository.save(crossBreedingRequest);

    const cat1 = await this.catService.findOne(
      crossBreedingRequest.askingCatId,
      true,
    );
    const cat2 = await this.catService.findOne(
      crossBreedingRequest.askedCatId,
      true,
    );

    const breedId = await this.catService.createCrossBreed(cat1, cat2);

    if (!breedId) {
      throw new Error('Cross breeding failed');
      return;
    }

    return await this.catService.create(
      {
        name: `${cat1.name} x ${cat2.name}`,
        breedId,
        age: 0,
      },
      userId,
      cat1.id,
      cat2.id,
    );
  }

  public async refuseCrossBreedingRequest(
    crossBreedingRequestId: number,
    userId: string,
  ): Promise<void> {
    const crossBreedingRequest =
      await this.crossBreedingRequestRepository.findOne({
        where: { id: crossBreedingRequestId, askedUserId: userId },
      });

    if (!crossBreedingRequest) {
      throw new Error('Cross breeding request not found');
    }

    if (crossBreedingRequest.status !== CrossBreedingRequestStatus.PENDING) {
      throw new Error('Cross breeding request is not pending');
    }

    crossBreedingRequest.status = CrossBreedingRequestStatus.REJECTED;

    await this.crossBreedingRequestRepository.save(crossBreedingRequest);
  }
}
