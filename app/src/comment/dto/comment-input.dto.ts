import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The subject of the comment',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'The description of the comment',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The id of the cat of the comment',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  catId: string;
}

/**
 * UpdateCommentDto is a partial type of CreateCommentDto,
 * all fields becomes optional,
 * with the catId field excluded.
 */
export class UpdateCommentDto extends PartialType(
  OmitType(CreateCommentDto, ['catId'] as const),
) {}
