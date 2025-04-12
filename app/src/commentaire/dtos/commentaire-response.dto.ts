import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CommentaireResponseDto {
  @ApiProperty({
    description: 'The id of the commentaire',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'The content of the commentaire',
    type: String,
  })
  @Expose()
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: 'The date of creation of the commentaire',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  created: Date;

  @ApiProperty({
    description: 'The date of update of the commentaire',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updated: Date;
}
