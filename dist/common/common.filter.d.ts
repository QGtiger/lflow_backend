import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
export declare class CommonFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
