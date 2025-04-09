import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateCommentaryDto {
    @ApiProperty({
        description: 'The content of the commentary',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({
        description: 'The ID of the related user',
        type: String,
    })
    @IsUUID()
    @IsNotEmpty()
    user: string;

    @ApiProperty({
        description: 'The ID of the related cat',
        type: String,
    })
    @IsUUID()
    @IsNotEmpty()
    cat: string;

}