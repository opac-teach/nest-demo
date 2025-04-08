import {ApiProperty} from "@nestjs/swagger";
import {Expose, Type} from "class-transformer";
import {CatResponseDto} from "@/cat/dtos/cat-response.dto";
import {IsUUID} from "class-validator";

export class UserResponseDto {

  @ApiProperty({ type: String })
  @Expose()
  id: string;

  @ApiProperty({
    description:"The username of the user",
    type: String })
  @Expose()
  @Type(() => String)
  username: string;

  @ApiProperty({
    description:"The firstname of the user",
    type: String })
  @Expose()
  @Type(() => String)
  firstname: string;

  @ApiProperty({
    description:"The lastname of the user",
    type: String })
  @Expose()
  @Type(() => String)
  lastname: string;

  @ApiProperty({
    description:"The email of the user",
    type: String })
  @Expose()
  @Type(() => String)
  email: string;

  @ApiProperty({ type: [CatResponseDto] })
  @Expose()
  @Type(() => CatResponseDto)
  cats?: CatResponseDto[];

  @ApiProperty({
    description: 'The date of creation of the user',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  created: Date;

  @ApiProperty({
    description: 'The date of update of the user',
    type: Date,
  })
  @Expose()
  @Type(() => Date)
  updated: Date;
}