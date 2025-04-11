import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({
        description: 'The content of the comment',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'The ID of the cat',
        type: String,
        format: 'uuid',
    })
    @IsUUID()
    @IsNotEmpty()
    catId: string;
}
