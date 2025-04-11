import { CatResponseDto } from '@/cat/dtos';
import { UserResponseDto } from '@/user/dtos/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CommentResponseDto {
  @ApiProperty({
    description: 'The id of the comment',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The subject of the comment',
    type: String,
  })
  @Expose()
  @Type(() => String)
  subject: string;

  @ApiProperty({
    description: 'The description of the comment',
    type: String,
  })
  @Expose()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'The cat of the comment',
    type: CatResponseDto,
  })
  @Expose()
  @Type(() => CatResponseDto)
  cat?: CatResponseDto;

  @ApiProperty({
    description: 'The user of the comment',
    type: UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @ApiProperty({
    description: 'The date of creation of the comment',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  created: Date;

  @ApiProperty({
    description: 'The date of update of the comment',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updated: Date;
}
