import {ApiProperty, OmitType, PartialType} from "@nestjs/swagger";
import {IsNotEmpty, IsString, IsUUID} from "class-validator";

export class CreateCommentDto {
    @ApiProperty({
        description: 'The title of the comment',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The text of the comment',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({
        description: 'The id of the cat',
        type: String,
    })
    @IsUUID()
    @IsNotEmpty()
    catId: string;
}

export class UpdateCommentDto {
    @ApiProperty({
        description: 'The title of the comment',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    title?: string;

    @ApiProperty({
        description: 'The text of the comment',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    text?: string;
}