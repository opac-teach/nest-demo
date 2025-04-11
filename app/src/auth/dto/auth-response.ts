import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({
    description: 'The access token of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  accessToken: string;
}
