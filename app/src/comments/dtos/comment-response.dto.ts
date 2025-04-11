import {ApiProperty} from "@nestjs/swagger";
import {Expose, Type} from "class-transformer";

export class CommentResponseDto {

  @ApiProperty({
    description: 'The id of the comment',
    type: String,
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    description: 'the content',
    type: String,
  })
  @Expose()
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: 'The date of comment creation',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  createdAt: Date;
}