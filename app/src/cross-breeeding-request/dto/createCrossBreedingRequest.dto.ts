import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCrossBreedingRequestDto {
  @IsString()
  @ApiProperty({
    description: 'The id of the asking cat',
    type: String,
  })
  askingCatId: string;

  @IsString()
  @ApiProperty({
    description: 'The id of the asked cat',
    type: String,
  })
  askedCatId: string;
}
