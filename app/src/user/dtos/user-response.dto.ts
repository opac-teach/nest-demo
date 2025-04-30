import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
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
    description: 'The sexe of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  sexe: String;

  @ApiProperty({
    description: 'The description of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  email: string;

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
