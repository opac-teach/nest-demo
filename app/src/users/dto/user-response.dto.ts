import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CatResponseDto } from '@/cat/dtos/cat-response.dto';

export class UserResponseDto {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Username',
    type: String,
  })
  @Expose()
  @Type(() => String)
  username: string;

  @ApiProperty({
    description: 'email',
    type: String,
  })
  @Expose()
  @Type(() => String)
  email: string;

  @ApiProperty({
    description: 'password',
    type: String,
  })
  @Expose()
  @Type(() => String)
  password: string;


  @ApiProperty({ type: [CatResponseDto] })
  @Expose()
  @Type(() => CatResponseDto)
  cats?: CatResponseDto[];
}
