import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database-config';
import { ArticleEntity } from './entities/article.entity';
import { ArticleContentEntity } from './entities/article-content.entity';
import { ArticleController } from './endpoints/article/article.controller';
import { ArticleService } from './endpoints/article/article.service';
import loggerConfig from './config/logger-config';
import { WinstonModule } from 'nest-winston';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { TagEntity } from './entities/tag.entity';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { SentryService } from './services/sentry.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { FileService } from './services/file.service';
import { EmailService } from './services/email.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ServeStaticModule.forRoot(
            {
                rootPath: join(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
                exclude: ['/api/(.*)'],
            },
        ),
        ConfigModule.forRoot(),
        CacheModule.register({
            ttl: 1000, // ms. 1s during developing. In prod, this could be higher.
        }),
        TypeOrmModule.forRoot(databaseConfig),
        TypeOrmModule.forFeature([
            ArticleEntity,
            ArticleContentEntity,
            TagEntity,
        ]),
        MailerModule.forRoot({
            transport: {
                host: 'localhost',
                port: 1025,
                ignoreTLS: true,
                secure: false,
            },
            preview: true,
            defaults: {
                from: '"Info" <test@test.com>',
            },
            template: {
                dir: __dirname + '/templates/emails',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        WinstonModule.forRoot(loggerConfig),
    ],
    controllers: [AppController, ArticleController],
    providers: [
        AppService,
        ArticleService,
        SentryService,
        FileService,
        EmailService,
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule {}

export const SERVER_URL: string = process.env.SERVER_URL ?? '';
