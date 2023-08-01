import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

/**
 * Error handler catching only HTTP exceptions.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }

    public catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: any = ctx.getResponse<Response>();
        const request: any = ctx.getRequest<Request>();
        const status: number = exception.getStatus();

        response
            .status(status)
            .json({
                statusCode: status,
                message: exception.message,
                error: exception.message,
            });

        this.logger.error(`HttpException ${status}: ${request.url}`);
        this.logger.error(exception.stack);
    }
}
