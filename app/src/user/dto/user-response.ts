import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserResponseDto {
    @Expose()
    @ApiProperty({
        description: 'The ID of the user',
        type: String,
    })
    @Type(() => String)
    id: string;

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
        description: 'The name of the user',
        type: String,
    })
    @Expose()
    @Type(() => String)
    name: string;

    @ApiProperty({
        description: 'The lastname of the user',
        type: String,
    })
    @Expose()
    @Type(() => String)
    lastname: string;

    @ApiProperty({
        description: 'The description of the user',
        type: String,
    })
    @Expose()
    @Type(() => String)
    description: string;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}
