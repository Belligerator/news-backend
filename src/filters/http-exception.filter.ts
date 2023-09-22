import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ContextType, HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

/**
 * Error handler catching only HTTP exceptions.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter, GqlExceptionFilter {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }

    public catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: any = ctx.getResponse<Response>();
        const request: any = ctx.getRequest<Request>();
        const status: number = exception.getStatus();

        const gqlHost: GqlArgumentsHost = GqlArgumentsHost.create(host);
        const gqlContext: ContextType = gqlHost.getType();

        // If HTTP context, return JSON response. Otherwise, return GraphQL response.
        if (gqlContext === 'http') {
            response
            .status(status)
            .json({
                statusCode: status,
                message: exception.message,
                error: exception.message,
            });

            this.logger.error(`HttpException ${status}: ${request.url}`);
        } else {
            this.logger.error(`HttpException ${status}: ${gqlHost.getInfo().fieldName}`);
        }

        this.logger.error(exception.stack);
    }
}
