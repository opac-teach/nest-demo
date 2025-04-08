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
 * with the breedId and userId fields excluded.
 */
export class UpdateCatDto extends PartialType(
  OmitType(CreateCatDto, ['breedId'] as const),
) {}

export class CreateKittenDto {
  @ApiProperty({
    description: 'The name of the kitten',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The id of the parent cat 1',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  parent1Id: string;

  @ApiProperty({
    description: 'The id of the parent cat 2',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  parent2Id: string;
}
