import { UserResponseDto } from '@/user/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CrossRequestResponseDto {
  @ApiProperty({
    description: 'The id of the cross request',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The sender of the cross request',
    type: UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  sender: UserResponseDto;

  @ApiProperty({
    description: 'The receiver of the cross request',
    type: UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  receiver: UserResponseDto;

  @ApiProperty({
    description: 'The status of the cross request',
    type: String,
  })
  @Expose()
  @Type(() => String)
  status: string;
}
