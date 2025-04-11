import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'string' })
  content: string;

  @IsUUID()
  @ApiProperty({ example: 'uuid-du-chat' })
  catId: string;
}
