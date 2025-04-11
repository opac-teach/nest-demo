import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';


export class AuthBodyDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @Length(6, 20)
    password: string;
}