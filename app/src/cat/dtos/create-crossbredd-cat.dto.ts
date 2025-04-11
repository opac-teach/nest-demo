import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCrossbreedCatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the cat',
    type: String,
  })
  catId1: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the cat',
    type: String,
  })
  catId2: string;

  @ApiProperty({
    description: 'The name of the cat',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The age of the cat',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  age: number;
}
