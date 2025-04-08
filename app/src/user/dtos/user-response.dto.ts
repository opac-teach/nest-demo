import { BreedResponseDto } from '@/breed/dtos/breed-response';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    description: 'The id of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'The age of the user',
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  age: number;

  @ApiProperty({
    description: 'The password of the user',
    type: Number,
  })
  @Expose()
  @Type(() => String)
  password: String;

  @ApiProperty({
    description: 'The sexe of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  sexe: String;

  @ApiProperty({
    description: 'The id of the breed of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'The date of creation of the user',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  created: Date;

  @ApiProperty({
    description: 'The date of update of the user',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updated: Date;

}
