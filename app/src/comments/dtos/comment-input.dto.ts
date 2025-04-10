import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment', type: String })
  @IsString()
  @IsNotEmpty()
  content: string;
}