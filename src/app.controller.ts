import { Controller, Get, InternalServerErrorException, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { SentryService } from './shared/services/sentry/sentry.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly sentryService: SentryService,
    ) {}

    /**
     * Get backend version.
     * @example 0.0.1
     * @returns backend version.
     */
    @ApiOperation({ summary: 'Get backend version.' })
    @Get()
    public getVersion(): string {
        return this.appService.getVersion();
    }

    /**
     * Example of serving static file from disk.
     */
    @ApiOperation({ summary: 'Get sample file.' })
    @Get('public/sample')
    public async getSample(@Res() response: Response): Promise<void> {
        try {
            const file: string = path.join(__dirname, 'assets', 'files', 'sample.pdf');
            response.setHeader('Content-type', 'text/markdown');
            response.setHeader('Content-disposition', 'attachment; filename=sample.pdf');
            fs.createReadStream(file).pipe(response);
        } catch (error) {
            this.sentryService.captureException(error);
            throw new InternalServerErrorException('Error while getting sample file.');
        }
    }
}
