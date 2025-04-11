import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, isString, IsString, IsUUID } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The password of the user account',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'token',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  access_token: string;
}