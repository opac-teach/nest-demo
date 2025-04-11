import { CatResponseDto } from '@/cat/dtos';
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
    description: 'The email address of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  email: string;

  @ApiProperty({
    description: 'The username of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  username: string;

  @ApiProperty({
    description: 'The first name of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  lastName: string;

  @ApiProperty({
    description: 'The age of the user',
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  age: number;

  @ApiProperty({
    description: 'The description of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  description: string;

  @ApiProperty({
    description: 'The cats of the user',
    type: CatResponseDto,
    isArray: true,
  })
  @Expose()
  @Type(() => CatResponseDto)
  cats?: CatResponseDto[];
}
