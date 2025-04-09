import { BreedResponseDto } from '@/breed/dtos';
import { CatEntity } from '@/cat/cat.entity';
import { BreedEntity } from '@/breed/breed.entity';
import { CatResponseDto } from '@/cat/dtos';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export interface HelloRequestDto {
  name: string;
}

export interface HelloResponseDto {
  message: string;
}

export interface SubscribeRequestDto {
  name: string;
}

export interface SubscribeResponseDto {
  clientId: string;
}

export class DataCrudEvent {
  action: 'create' | 'update' | 'delete';
  model: 'cat' | 'breed';
  @Expose()
  @Type(() => CatResponseDto)
  cat?: CatResponseDto;

  @Expose()
  @Type(() => BreedResponseDto)
  breed?: BreedResponseDto;
}

@Exclude()
export class PublicDataCrudEvent {
  @ApiProperty({
    description: 'The action of the event',
    type: String,
  })
  @Expose()
  @Type(() => String)
  action: 'create' | 'update' | 'delete';

  @ApiProperty({
    description: 'The model of the event',
    type: String,
  })
  @Expose()
  @Type(() => String)
  model: 'cat' | 'breed';

  @ApiProperty({
    description: 'The cat of the event',
    type: CatResponseDto,
  })
  @Expose()
  @Type(() => CatResponseDto)
  cat?: CatResponseDto;

  @ApiProperty({
    description: 'The breed of the event',
    type: BreedResponseDto,
  })
  @Expose()
  @Type(() => BreedResponseDto)
  breed?: BreedResponseDto;
}
