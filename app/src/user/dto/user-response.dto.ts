import {ApiProperty} from "@nestjs/swagger";
import {Exclude, Expose, Type} from "class-transformer";
import {CatResponseDto} from "@/cat/dtos";

export class UserResponseDto {
    @ApiProperty({
        description: 'The id of the user',
        type: String
    })
    @Expose()
    @Type(() => String)
    id: String

    @ApiProperty({
        description: 'The name of the user',
        type: String,
    })
    @Expose()
    @Type(() => String)
    name: string;

    @ApiProperty({
        description: 'The description of the user',
        type: String,
    })
    @Expose()
    @Type(() => String)
    description: string;

    @ApiProperty({
        description: 'The email of the user',
        type: String,
    })
    @Expose()
    @Type(() => String)
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        type: String,
    })
    @Exclude()
    @Type(() => String)
    password: string;

    @ApiProperty({
        description: 'The list of cats owned by the user',
        type: [ CatResponseDto ],
    })
    @Expose()
    @Type(() => CatResponseDto)
    cats: CatResponseDto[];

    @ApiProperty({
        description: 'The date of creation of the user',
        type: Date,
    })
    @Expose()
    @Type(() => Date)
    created: Date;

    @ApiProperty({
        description: 'The date of update of the user',
        type: Date,
    })
    @Expose()
    @Type(() => Date)
    updated: Date;
}