import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CrossRequestInputDto {
  @ApiProperty({
    description: 'The sender cat id',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  senderCatId: string;

  @ApiProperty({
    description: 'The receiver cat id',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  receiverCatId: string;
}
