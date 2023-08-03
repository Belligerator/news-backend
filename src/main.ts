import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
const { version } = require('../package.json');
import * as Sentry from '@sentry/node';

async function bootstrap() {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'production',
        release: version,
        maxValueLength: 8192, // Do not truncate stack traces.
    });

    // https://stackoverflow.com/questions/72466834/nestjs-logs-have-weird-characters-in-log-management-tools
    process.env.NO_COLOR = 'true';

    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('News')
        .setDescription('Backend for the news app.')
        .setVersion(version)
        .addTag('Application')
        .addTag('Administration')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    app.enableCors();
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    await app.listen(3000);
}
bootstrap();
