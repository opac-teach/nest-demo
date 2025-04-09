import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  @IsUUID()
  catId: string;
}
