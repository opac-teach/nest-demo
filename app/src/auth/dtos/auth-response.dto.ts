import { UserEntity } from '@/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

@Expose()
export class LoginResponseDto {
  @ApiProperty({
    description: 'The user login',
    type: UserEntity,
  })
  @Type(() => UserEntity)
  user: UserEntity;

  @ApiProperty({
    description: 'The token of user',
    type: String,
  })
  @Type(() => String)
  token: string;
}
