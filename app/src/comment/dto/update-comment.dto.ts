import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(
    OmitType(CreateCommentDto, ['catId'] as const),
) {}
