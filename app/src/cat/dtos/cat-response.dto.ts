import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { BreedResponseDto } from '@/breed/dtos/breed-response';

@Exclude()
@ObjectType()
export class CatResponseDto {
  @ApiProperty({
    description: 'The id of the cat',
    type: String,
  })
  @Expose()
  @Type(() => String)
  @Field((type) => ID)
  id: string;

  @ApiProperty({
    description: 'The name of the cat',
    type: String,
  })
  @Expose()
  @Type(() => String)
  @Field()
  name: string;

  @ApiProperty({
    description: 'The age of the cat',
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  @Field((type) => Int)
  age: number;

  @ApiProperty({
    description: 'The breed of the cat',
    type: BreedResponseDto,
  })
  @Expose()
  @Type(() => BreedResponseDto)
  @Field((type) => BreedResponseDto)
  breed?: BreedResponseDto;

  @ApiProperty({
    description: 'The id of the breed of the cat',
    type: String,
  })
  @Expose()
  @Type(() => String)
  @Field((type) => ID)
  breedId: string;

  @ApiProperty({
    description: 'The date of creation of the cat',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  @Field()
  created: Date;

  @ApiProperty({
    description: 'The date of update of the cat',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  @Field()
  updated: Date;

  @ApiProperty({
    description: 'The color of the cat',
    type: String,
  })
  @Expose()
  @Field()
  color: string;

  constructor(partial: Partial<CatResponseDto>) {
    Object.assign(this, partial);
  }
}
