import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
			description: 'The name of the user',
			type: String,
	})
	@IsString()
	@IsNotEmpty()
	name: string;

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
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: 'The description of the user',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({
		description: 'The password of the user',
		type: String,
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}