import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class CommonFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const res = exception.getResponse() as any;

    const errorResponse = {
      success: false,
      message: res.message?.join
        ? res.message.join(', ')
        : res.message || exception.message,
      code: exception.getStatus(),
    };

    response.status(200).json(errorResponse);
  }
}
