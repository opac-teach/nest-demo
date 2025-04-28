import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { CatResponseDto } from '@/cat/dtos/cat-response.dto';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@Exclude()
@ObjectType()
export class BreedResponseDto {
  @ApiProperty({ type: String })
  @Expose()
  @Field((type) => ID)
  id: string;

  @ApiProperty({
    description: 'The name of the breed',
    type: String,
  })
  @Expose()
  @Type(() => String)
  @Field()
  name: string;

  @ApiProperty({ description: 'The description of the breed', type: String })
  @Expose()
  @Type(() => String)
  @Field()
  description: string;

  @ApiProperty({ type: [CatResponseDto] })
  @Expose()
  @Type(() => CatResponseDto)
  @Field((type) => [CatResponseDto])
  cats?: CatResponseDto[];
}
