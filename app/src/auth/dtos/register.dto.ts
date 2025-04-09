import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import {CreateUserDto} from "@/user/dtos";
import {ApiProperty, OmitType} from '@nestjs/swagger';

export class RegisterDto extends OmitType(CreateUserDto, ['firstname', 'lastname'] as const) {
  @ApiProperty({
    description: 'The username of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username:string;

  @ApiProperty({
    description: 'The firstname of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  firstname:string;

  @ApiProperty({
    description: 'The lastname of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastname:string;

  @ApiProperty({
    description: 'The email address of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email:string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password:string;

}