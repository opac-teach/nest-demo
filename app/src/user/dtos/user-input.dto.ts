import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateuserDto {
  
  @ApiProperty({
    description: 'The password of the user',
    type: String,
  })

  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The name of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The age of the user',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'The description of the breed of the user',
    type: String,
  })

  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The sexe of the user',
    type: String,
  })

  @IsString()
  @IsNotEmpty()
  sexe: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
  })

  @IsString()
  @IsNotEmpty()
  email: string;
}

/**
 * UpdateuserDto is a partial type of CreateuserDto,
 * all fields becomes optional,
 * with the breedId field excluded.
 */
export class UpdateuserDto extends PartialType(CreateuserDto) {}
