import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBreedDto {
  @ApiProperty({
    description: 'The name of the breed',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the breed',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
