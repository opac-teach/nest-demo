import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBreedDto {
  @ApiProperty({
    description: 'The name of the breed',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @ApiProperty({
    description: 'The description of the breed',
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;
}
