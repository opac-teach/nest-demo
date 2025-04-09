import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

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
  @Min(0)
  age: number;

  @ApiProperty({
    description: 'The UUID of the breed of the cat',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  breedId: string;
}

export class UpdateCatDto extends PartialType(
  OmitType(CreateCatDto, ['breedId'] as const),
) {}
