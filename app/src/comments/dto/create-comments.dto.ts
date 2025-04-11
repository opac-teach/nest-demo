import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCommentsDto {
  @ApiProperty({
    description: 'Content of comments',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Id of cat of comments',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  catId: string;
}