import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}