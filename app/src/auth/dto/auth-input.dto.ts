import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class SignInDto {
    @ApiProperty({
        description: 'Email of the account user',
        type: String
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    username: string

    @ApiProperty({
        description: 'Password of the account user',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    password: string
}