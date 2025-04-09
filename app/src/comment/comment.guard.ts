import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {CommentService} from "@/comment/comment.service";

@Injectable()
export class CommentGuard implements CanActivate {
    constructor(private readonly commentService: CommentService) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.sub;
        const commentId = request.params.id;
        const comment = await this.commentService.findOne(commentId);
        if (!comment || comment.authorId !== userId) {
            throw new UnauthorizedException('You are not authorized to access this comment');
        }
        return true;
    }
}
