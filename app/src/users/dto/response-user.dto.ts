import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';


export class ResponseUserDto {
    @ApiProperty({
       description: 'The id of the user',
       type: String,
    })
    @Expose()
    @Type(() => String)
    id: string;

    @ApiProperty({
       description: 'The name of the user',
       type: String,
    })
    @Expose()
    @Type(() => String)
    name: string;

    @ApiProperty({
       description: 'The username of the user',
       type: String,
    })
    @Expose()
    @Type(() => String)
    username: string;

    @ApiProperty({
       description: 'The email of the user',
       type: String,
    })
    @Expose()
    @Type(() => String)
    email: string;

    @ApiProperty({
       description: 'The description of the user',
       type: String,
    })
    @Expose()
    @Type(() => String)
    description: string;

    @ApiProperty({
       description: 'The password of the user',
       type: String,
    })
    @Expose()
    @Type(() => String)
    password: string;

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

    @ApiProperty({
        description: 'The commentaries of the user',
        type: String,
    })
    @Expose()
    @Type(() => String)
    commentaries: string[];
}