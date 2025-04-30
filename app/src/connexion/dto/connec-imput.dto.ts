import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class SignInDto {

    @ApiProperty({
        description: 'the email of the user',
        type: String,
    })

    @IsString()
    @IsNotEmpty()
    email: string; 

    @ApiProperty({
        description: 'the password of the user',
        type: String,
    })

    @IsString()
    @IsNotEmpty()
    password: string;
}