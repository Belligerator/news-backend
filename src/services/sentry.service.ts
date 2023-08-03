import { Inject, Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SentryService {

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) { }

    public captureException(message: string, data?: any): void {
        this.logger.error(`[Sentry captureException]: ${message}`);
        this.logger.error(data);
        Sentry.captureException(`${message} ---\n${data}`);
    }

}
