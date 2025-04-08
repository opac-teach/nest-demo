import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCatDto {
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

  @ApiProperty({
    description: 'The id of the breed of the cat',
    type: Number,
  })
  @IsUUID()
  @IsNotEmpty()
  breedId: string;
}

/**
 * UpdateCatDto is a partial type of CreateCatDto,
 * all fields becomes optional,
 * with the breedId field excluded.
 */
export class UpdateCatDto extends PartialType(
  OmitType(CreateCatDto, ['breedId'] as const),
) {}


export class BreedCatsDto {
  @IsUUID()
  @ApiProperty({ description: 'Father cat id', type: String })
  fatherId: string;

  @IsUUID()
  @ApiProperty({ description: 'Mother cat id', type: String })
  motherId: string;

  @IsString()
  @ApiProperty({ description: 'The name of baby cat', type: String })
  name: string;
}
