import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as path from 'path';
import * as Sentry from '@sentry/node';
import * as admin from 'firebase-admin';

const { version } = require('../package.json');

async function bootstrap(): Promise<void> {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'production',
        release: version,
        maxValueLength: 8192, // Do not truncate stack traces.
    });

    admin.initializeApp({
        credential: admin.credential.cert(path.join(__dirname, 'assets/certs/serviceAccountKey.json'))
    });
    
    // https://stackoverflow.com/questions/72466834/nestjs-logs-have-weird-characters-in-log-management-tools
    process.env.NO_COLOR = 'true';

    const app: INestApplication = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
        .setTitle('News')
        .setDescription('Backend for the news app.')
        .setVersion(version)
        .addTag('Application')
        .addTag('Administration')
        .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document);

    app.enableCors();
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
