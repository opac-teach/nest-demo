import {IsNotEmpty, IsString} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ description: 'The updated content of the comment', type: String })
  @IsString()
  @IsNotEmpty()
  content: string;
}