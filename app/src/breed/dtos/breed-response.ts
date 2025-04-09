import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { CatResponseDto } from '@/cat/dtos/cat-response.dto';

@Exclude()
export class BreedResponseDto {
  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the breed',
    type: String,
  })
  @Expose()
  @Type(() => String)
  name: string;

  @ApiProperty({ description: 'The description of the breed', type: String })
  @Expose()
  @Type(() => String)
  description: string;

  @ApiProperty({ type: [CatResponseDto] })
  @Expose()
  @Type(() => CatResponseDto)
  cats?: CatResponseDto[];
}
