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
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const { method, path } = request;

    this.logger.debug(
      `${method} ${path}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );
    this.logger.debug(`Request body: ${JSON.stringify(request.body)}`);

    return next.handle().pipe(
      tap({
        next: (value) => {
          this.logger.debug(
            `${method} ${path} response: \n ${JSON.stringify(value)} \n`,
          );
        },
        error: (err) => {
          this.logger.error(
            `${method} ${path} error: \n ${JSON.stringify(err)} \n message: ${
              err.message
            } \n`,
          );
        },
      }),
    );
  }
}
