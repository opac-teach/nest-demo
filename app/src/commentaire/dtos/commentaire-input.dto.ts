import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentaireDto {
  @ApiProperty({
    description: 'The content of the commentaire',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The id of the cat',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  catId: string;
}

/**
 * UpdateCommentaireDto is a partial type of CreateCommentaireDto,
 * all fields becomes optional,
 * with the catId field excluded.
 */
export class UpdateCommentaireDto extends PartialType(
  OmitType(CreateCommentaireDto, ['catId'] as const),
) {}
