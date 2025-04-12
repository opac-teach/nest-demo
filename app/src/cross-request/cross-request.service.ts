import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CrossRequestEntity, CrossRequestStatus } from './cross-request.entity';
import { CatService } from '@/cat/cat.service';
import { CrossRequestInputDto } from './dtos';

export interface CrossRequestFindAllOptions
  extends FindManyOptions<CrossRequestEntity> {
  forMe?: boolean;
  fromMe?: boolean;
}

export interface CrossRequestFindOneOptions
  extends FindOneOptions<CrossRequestEntity> {
  catId1?: string;
  catId2?: string;
  requestId?: string;
  status?: CrossRequestStatus;
  isUsed?: boolean;
}

@Injectable()
export class CrossRequestService {
  constructor(
    @InjectRepository(CrossRequestEntity)
    private crossRequestRepository: Repository<CrossRequestEntity>,
    @Inject(forwardRef(() => CatService))
    private readonly catService: CatService,
  ) {}

  async findAllCrossRequests(
    userId: string,
    options?: CrossRequestFindAllOptions,
  ): Promise<CrossRequestEntity[]> {
    return this.crossRequestRepository.find({
      where: {
        senderId: options?.fromMe ? userId : undefined,
        receiverId: options?.forMe ? userId : undefined,
      },
    });
  }

  async findOneCrossRequest(
    options?: CrossRequestFindOneOptions,
  ): Promise<CrossRequestEntity> {
    const crossRequest = await this.crossRequestRepository.findOne({
      where: options?.requestId
        ? { id: options.requestId }
        : [
            {
              senderCatId: options?.catId1,
              receiverCatId: options?.catId2,
              status: options?.status,
              isUsed: options?.isUsed,
            },
            {
              senderCatId: options?.catId2,
              receiverCatId: options?.catId1,
              status: options?.status,
              isUsed: options?.isUsed,
            },
          ],
    });

    if (!crossRequest) {
      throw new NotFoundException('Cross request not found');
    }

    return crossRequest;
  }

  async createCrossRequest(
    crossRequestInput: CrossRequestInputDto,
    userId: string,
  ): Promise<CrossRequestEntity> {
    // le chat que l'on souhaite croiser avec le notre
    const catOfReceiver = await this.catService.findOne(
      crossRequestInput.receiverCatId,
    );

    // le chat que nous souhaitons croiser
    const catOfSender = await this.catService.findOne(
      crossRequestInput.senderCatId,
    );

    // on vérifie que le chat que nous souhaitons croiser nous appartient
    if (catOfSender.userId !== userId) {
      throw new BadRequestException(
        'Le chat que vous souhaitez croiser ne vous appartient pas',
      );
    }

    // on vérifie que le chat que l'on souhaite croiser avec le notre ne nous appartient pas
    if (catOfReceiver.userId === userId) {
      throw new BadRequestException(
        'Impossible de créer une demande de croisement avec soi-même',
      );
    }

    // on vérifie qu'une requête n'existe pas déjà
    const existingRequest = await this.crossRequestRepository.findOne({
      where: {
        ...crossRequestInput,
        senderId: userId,
        status: CrossRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'Une demande de croisement est déjà en attente',
      );
    }

    const crossRequest = this.crossRequestRepository.create({
      ...crossRequestInput,
      senderId: userId,
      receiverId: catOfReceiver.userId,
      status: CrossRequestStatus.PENDING,
    });
    return this.crossRequestRepository.save(crossRequest);
  }

  async answerCrossRequest(
    requestId: string,
    userId: string,
    accept: boolean,
  ): Promise<CrossRequestEntity> {
    const crossRequest = await this.findOneCrossRequest({
      requestId,
    });

    if (crossRequest.receiverId !== userId) {
      throw new BadRequestException('Cette requête ne vous ai pas destinée.');
    }

    if (crossRequest.status !== CrossRequestStatus.PENDING) {
      throw new BadRequestException("Cette requête n'est plus en attente.");
    }

    crossRequest.status = accept
      ? CrossRequestStatus.ACCEPTED
      : CrossRequestStatus.REJECTED;

    if (accept) {
      console.log('Création du croisement accepté', crossRequest);
      // TODO: Envoyer une alert (via websocket?) au sender afin de lui indiquer que la requête a été acceptée
    }

    return this.crossRequestRepository.save(crossRequest);
  }

  async update(
    requestId: string,
    data: Partial<CrossRequestEntity>,
  ): Promise<void> {
    await this.crossRequestRepository.update(requestId, data);
  }
}
