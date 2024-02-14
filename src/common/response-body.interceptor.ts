import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((result) => {
        // 기존 API사용시 추후 제거
        if (request.path.indexOf('find') > 0) {
          return result;
        }

        if (typeof result === 'object' && typeof result?.length === 'number') {
          return {
            data: result,
          };
        }

        if (typeof result === 'object') {
          return {
            data: result,
          };
        }
      }),
    );
  }
}
