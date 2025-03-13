import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CatResponseDto {
  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({ type: String })
  @Expose()
  @Type(() => String)
  name: string;

  @ApiProperty({ type: Number })
  @Expose()
  @Type(() => Number)
  age: number;
}

export class CatsResponseDto {
  @ApiProperty({ type: [CatResponseDto] })
  @Expose()
  @Type(() => CatResponseDto)
  cats: CatResponseDto[];
}
