import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateCatDto {
  @ApiProperty({
    description: 'The name of the cat',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @ApiProperty({
    description: 'The age of the cat',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Field((type) => Int)
  age: number;

  @ApiProperty({
    description: 'The id of the breed of the cat',
    type: Number,
  })
  @IsUUID()
  @IsNotEmpty()
  @Field()
  breedId: string;
}

/**
 * UpdateCatDto is a partial type of CreateCatDto,
 * all fields becomes optional,
 * with the breedId field excluded.
 */
@InputType()
export class UpdateCatDto extends PartialType(
  OmitType(CreateCatDto, ['breedId'] as const),
) {
  @Field({ nullable: true })
  name?: string;

  @Field((type) => Int, { nullable: true })
  age?: number;
}
