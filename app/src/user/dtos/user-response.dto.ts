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
    description: 'The email of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  email: string;

  @ApiProperty({
    description: 'The created date of the user',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  created: Date;

  @ApiProperty({
    description: 'The updated date of the user',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updated: Date;
}
