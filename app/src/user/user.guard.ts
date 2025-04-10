import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OwnerGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.sub
        const resourceId = request.params.id

        if (userId !== resourceId) {
            throw new UnauthorizedException('You are not authorized to access this resource');
        }

        return true;
    }
}
