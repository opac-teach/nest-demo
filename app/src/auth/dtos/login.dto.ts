import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'exemple@email.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'monSuperMotDePasse' })
  password: string;
}
