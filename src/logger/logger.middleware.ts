import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`[LOGGER] Request: ${req.method} ${req.originalUrl}`);
    next();
  }
}
