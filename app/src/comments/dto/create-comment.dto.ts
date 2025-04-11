import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  chatId: number;@IsNotEmpty()

  @IsNotEmpty()
  @IsNumber()
  usertId: number;
}
