import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The username of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'A brief description of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
