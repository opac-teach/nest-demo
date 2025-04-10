import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString, IsEmail} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The username of the user',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'The email of the user',
        type: String,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The name of the user',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The lastname of the user',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({
        description: 'The password of the user',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'The description of the user',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}
