import {ApiProperty} from "@nestjs/swagger";
import {Expose, Type} from "class-transformer";
import {UserResponseDto} from "@/user/dto";
import {CatResponseDto} from "@/cat/dtos";

export class CommentResponseDto {
    @ApiProperty({
        description: 'The id of the comment',
        type: String,
    })
    @Expose()
    @Type(() => String)
    id: string;

    @ApiProperty({
        description: 'The title of the comment',
        type: String,
    })
    @Expose()
    title: string;

    @ApiProperty({
        description: 'The text of the comment',
        type: String,
    })
    @Expose()
    text: string;

    @ApiProperty({
        description: 'The cat of the comment',
        type: CatResponseDto,
    })
    @Expose()
    @Type(() => CatResponseDto)
    cat?: CatResponseDto;

    @ApiProperty({
        description: 'The user of the comment',
        type: UserResponseDto,
    })
    @Expose()
    @Type(() => UserResponseDto)
    author?: UserResponseDto;

    @ApiProperty({
        description: 'The date of creation of the comment',
        type: Date,
    })
    @Expose()
    @Type(() => Date)
    created: Date;

    @ApiProperty({
        description: 'The date of update of the comment',
        type: Date,
    })
    @Expose()
    @Type(() => Date)
    updated: Date;
}