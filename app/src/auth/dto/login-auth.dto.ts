import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginAuthDto {
    @ApiProperty({
        description: 'The email of the user',
        type: String,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
