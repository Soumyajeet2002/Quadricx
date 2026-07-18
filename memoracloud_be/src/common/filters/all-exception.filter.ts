import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { COMMON } from '../messages/common.msg';

// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();

//     let status: number;
//     let message: string;

//     // ✅ Known HTTP errors
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse() as any;

//       switch (status) {
//         case HttpStatus.BAD_REQUEST:
//           message = this.handleBadRequest(res);
//           break;

//         case HttpStatus.UNAUTHORIZED:
//           message = COMMON.ERRORS.UNAUTHORIZED;
//           break;

//         case HttpStatus.FORBIDDEN:
//           message = COMMON.ERRORS.FORBIDDEN;
//           break;

//         case HttpStatus.NOT_FOUND:
//           message = COMMON.ERRORS.NOT_FOUND;
//           break;

//         default:
//           message = res?.message || COMMON.ERRORS.INTERNAL_SERVER_ERROR;
//       }
//     }
//     // ❌ Unknown / system errors
//     else {
//       status = HttpStatus.INTERNAL_SERVER_ERROR;
//       message = COMMON.ERRORS.INTERNAL_SERVER_ERROR;
//     }

//     return response.status(status).json({
//       status,
//       message,
//       data: [],
//     });
//   }

//   private handleBadRequest(res: any): string {
//     // class-validator errors
//     if (Array.isArray(res?.message)) {
//       return res.message[0];
//     }
//     return res?.message || COMMON.ERRORS.BAD_REQUEST;
//   }
// }


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      const customMessage =
        typeof res === 'string' ? res : res?.message;

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          message = this.handleBadRequest(res);
          break;

        case HttpStatus.UNAUTHORIZED:
          message = customMessage || COMMON.ERRORS.UNAUTHORIZED;
          break;

        case HttpStatus.FORBIDDEN:
          message = customMessage || COMMON.ERRORS.FORBIDDEN;
          break;

        case HttpStatus.NOT_FOUND:
          message = customMessage || COMMON.ERRORS.NOT_FOUND;
          break;

        default:
          message = customMessage || COMMON.ERRORS.INTERNAL_SERVER_ERROR;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = COMMON.ERRORS.INTERNAL_SERVER_ERROR;
    }

    return response.status(status).json({
      status,
      message,
      data: [],
    });
  }

  private handleBadRequest(res: any): string {
    if (Array.isArray(res?.message)) {
      return res.message[0];
    }
    return res?.message || COMMON.ERRORS.BAD_REQUEST;
  }
}