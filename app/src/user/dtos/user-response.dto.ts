import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

@Expose()
export class UserResponseDto {
  @ApiProperty({
    description: 'The id of the user',
    type: String,
  })
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    type: String,
  })
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
  })
  @Type(() => String)
  email: string;

  @ApiProperty({
    description: 'The created date of the user',
    type: Date,
  })
  @Type(() => Date)
  created: Date;

  @ApiProperty({
    description: 'The updated date of the user',
    type: Date,
  })
  @Type(() => Date)
  updated: Date;
}
