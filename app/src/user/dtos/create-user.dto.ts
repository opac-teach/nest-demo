import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'string' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'string' })
  password: string;

  @IsOptional()
  @ApiProperty({ example: 'string' })
  @IsString()
  description?: string;
}