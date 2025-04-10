import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {

@ApiProperty({
    description: 'id of user',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  id?: number;


  @ApiProperty({
    description: ' username',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  

  @ApiProperty({
    description: 'email',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  

  @ApiProperty({
    description: 'password',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;


}


export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['id'] as const),
) {}
