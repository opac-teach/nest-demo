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

  @ApiProperty({
    description: 'The id of the owner of the cat',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  ownerId: string
}

/**
 * UpdateCatDto is a partial type of CreateCatDto,
 * all fields becomes optional,
 * with the breedId field excluded.
 */
export class UpdateCatDto extends PartialType(
  OmitType(CreateCatDto, ['breedId', 'ownerId'] as const),
) {}
