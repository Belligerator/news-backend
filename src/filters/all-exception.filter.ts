import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ErrorResponse } from 'src/models/dtos/error-response.dto';
import { SentryService } from 'src/services/sentry.service';

/**
 * Default error handler catching all but HTTP exceptions.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost,
                private readonly sentryService: SentryService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    }

    public catch(exception: any, host: ArgumentsHost): void {
        const httpAdapter: any = this.httpAdapterHost.httpAdapter;

        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: any = ctx.getResponse<Response>();
        const request: any = ctx.getRequest<Request>();
        const status: number = HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody: ErrorResponse = {
            statusCode: status,
            message: 'Internal server error occurred, please contact the administrator.',
            error: exception['message'],
        };

        httpAdapter.reply(response, responseBody, status);
        this.sentryService.captureException(`Internal server error ${status}: ${request.url}`, exception['stack']);
    }
}
