import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CatService } from './cat.service'; // Service pour récupérer le chat

@Injectable()
export class CatGuard implements CanActivate {
    constructor(private readonly catService: CatService) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.sub;
        const catId = request.params.id;
        const cat = await this.catService.findOne(catId);
        if (!cat || cat.ownerId !== userId) {
            throw new UnauthorizedException('You are not authorized to access this cat');
        }
        return true;
    }
}
