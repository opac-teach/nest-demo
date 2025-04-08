import { BreedResponseDto } from '@/breed/dtos/breed-response';
import { UserResponseDto } from '@/user/dtos/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

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

  @ApiProperty({
    description: 'The breed of the cat',
    type: BreedResponseDto,
  })
  @Expose()
  @Type(() => BreedResponseDto)
  breed?: BreedResponseDto;

  @ApiProperty({
    description: 'The user of the cat',
    type: UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

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
}
