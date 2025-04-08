import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrossBreedingRequestEntity } from '@/cross-breeeding-request/entity/crossBreedingRequest.entity';
import { Repository } from 'typeorm';
import { CreateCrossBreedingRequestDto } from '@/cross-breeeding-request/dto/createCrossBreedingRequest.dto';
import { CatService } from '@/cat/cat.service';
import CrossBreedingRequestStatus from '@/lib/crossBreedingRequestStatus.enum';

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
}
