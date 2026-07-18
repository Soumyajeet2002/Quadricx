import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((resData) => {
        const httpStatus = response.statusCode;
        //console.log('Response Interceptor - Status:', httpStatus, 'Data:', data);
        console.log('Response Interceptor - Status:', httpStatus, 'Data:', resData);
        let data :any=resData;

        if (resData && typeof resData === 'object' && 'message' in resData) {
          const { message: _, ...rest } = resData;
          data = rest;
        }
        return {
          status: httpStatus,
          message: resData?.message || 'Success',
          data: data ?? [],
        };
      }),
    );
  }
}
