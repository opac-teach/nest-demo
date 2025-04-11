import { BreedResponseDto } from '@/breed/dtos/breed-response';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import {IsUUID} from "class-validator";
import { CommentResponseDto } from '@/comments/dtos/comment-response.dto';

@Exclude()
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

  // @ApiProperty({
  //   description: 'The id of the breed of the cat',
  //   type: String,
  // })
  // @Expose()
  // @IsUUID()
  // breedId: string;

  @ApiProperty({
    description: 'The id of the user of the cat',
    type: String,
  })
  @Expose()
  @IsUUID()
  userId: string;

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

  @ApiProperty({
    description: 'The color of the cat',
    type: String,
  })
  @Expose()
  color: string;

  constructor(partial: Partial<CatResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ type: [CommentResponseDto] })
  @Expose()
  @Type(() => CommentResponseDto)
  comments?: CommentResponseDto[];

}
