import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        return this.logger.log(
          `${request.method} ${request.path} ${endTime - startTime}ms`,
          'REQUEST',
        );
      }),
    );
  }
}
