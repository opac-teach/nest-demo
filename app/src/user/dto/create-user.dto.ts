import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'A brief description of the user',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The ID of the cat user',
    type: String })
  @IsUUID()
  catId?: string;
}
