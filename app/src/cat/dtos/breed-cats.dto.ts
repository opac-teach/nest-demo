import { IsUUID, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BreedCatsDto {
  @IsUUID()
  @ApiProperty({
    description: 'The id of the first parent cat',
    type: String,
  })
  catId1: string;

  @ApiProperty({
    description: 'The id of the second parent cat',
    type: String,
  })
  @IsUUID()
  catId2: string;

  @ApiPropertyOptional({
    example: 'string (optional)',
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

}
