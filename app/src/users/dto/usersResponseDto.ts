import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UsersInfoDto {

  @ApiProperty({
    description: 'The id of the user',
    type: Number,
  })
  @Expose()
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: 'The username of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  username: string;
  @ApiProperty({
    description: 'The firstname of the user',
    type: String,
  })

  @Expose()
  @Type(() => String)
  firstname: string;

  @ApiProperty({
    description: 'The lastname of the user',
    type: String,
  })
  @Expose()
  @Type(() => String)
  lastname: string;

  constructor(partial: Partial<UsersInfoDto>) {
    Object.assign(this, partial);
  }
}

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'success of request',
    type: Boolean,
  })
  @Expose()
  @Type(() => Boolean)
  success: boolean;

  @ApiProperty({
    description: 'message',
    type: String,
  })
  @Expose()
  @Type(() => String)
  message: string;
}