import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserBodyDto {

    @Length(2, 20)
    @IsString()
    firstname: string;

    @Length(2, 20)
    @IsString()
    lastname: string;

    @Length(2, 20)
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @Length(6, 30)
    @IsString()
    password: string;

}