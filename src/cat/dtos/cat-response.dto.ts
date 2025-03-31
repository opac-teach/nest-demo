import { BreedResponseDto } from '@/breed/dtos/breed-response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CatResponseDto {
  @ApiProperty({
    description: 'The id of the cat',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The name of the cat',
    type: String,
  })
  @Expose()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'The age of the cat',
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  age: number;

  @ApiProperty({
    description: 'The id of the breed of the cat',
    type: String,
  })
  @Expose()
  @Type(() => String)
  breedId: string;

  @ApiProperty({
    description: 'The breed of the cat',
    type: BreedResponseDto,
  })
  @Expose()
  @Type(() => BreedResponseDto)
  breed?: BreedResponseDto;

  @ApiProperty({
    description: 'The date of creation of the cat',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  created: Date;

  @ApiProperty({
    description: 'The date of update of the cat',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updated: Date;
}
