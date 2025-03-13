import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateCatDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  age: number;
}

export class UpdateCatDto extends PartialType(CreateCatDto) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  id: string;
}
