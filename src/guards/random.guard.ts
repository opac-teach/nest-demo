import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ImATeapotException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RandomGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const canPass = Math.random() > 0.5;

    if (!canPass) {
      throw new ImATeapotException('Request randomly aborted');
    }
    return true;
  }
}
