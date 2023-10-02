import { HttpStatus, Module } from '@nestjs/common';
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
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { TagEntity } from './entities/tag.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { SentryService } from './services/sentry.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { FileService } from './services/file.service';
import { EmailService } from './services/email.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TagService } from './endpoints/tag/tag.service';
import { TagController } from './endpoints/tag/tag.controller';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { PushNotificationService } from './endpoints/push-notification/push-notification.service';
import { ArticleSearchService } from './endpoints/article/search/article-search.service';
import { ArticleSearchController } from './endpoints/article/search/article-search.controller';
import { PushNotificationController } from './endpoints/push-notification/push-notification.controller';
import { PushTokenEntity } from './entities/push-token.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './services/cron-job.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BasicStrategy } from './endpoints/auth/strategies/basic.strategy';
import { ExcelService } from './services/excel.service';
import { AuthService } from './endpoints/auth/auth.service';
import { JwtStrategy } from './endpoints/auth/strategies/jwt.strategy';
import { AuthController } from './endpoints/auth/auth.controller';
import { LocalStrategy } from './endpoints/auth/strategies/local.strategy';
import { UserEntity } from './entities/user.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TagResolver } from './graphql/tag.resolver';
import { TagGQLService } from './graphql/tag.service';
import { GraphQLError } from 'graphql';
import { ErrorResponse } from './models/dtos/error-response.dto';

@Module({
    imports: [
        ServeStaticModule.forRoot(
            {
                rootPath: join(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            },
            {
                rootPath: join(__dirname, '..', 'documentation'),
                serveRoot: '/api/documentation',
            },
        ),
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),
        CacheModule.register({
            // ms. 1s during developing. In prod, this could be higher and should be set for specific endpoints.
            ttl: 1000,
            max: 10,
        }),
        TypeOrmModule.forRoot(databaseConfig),
        TypeOrmModule.forFeature([
            ArticleEntity,
            ArticleContentEntity,
            TagEntity,
            PushTokenEntity,
            UserEntity
        ]),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: join(__dirname, 'assets', 'i18n'),
                watch: true,
            },
            resolvers: [
                { use: HeaderResolver, options: ['x-language'] }
            ]
        }),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.freesmtpservers.com',
                port: 25,
                ignoreTLS: true,
                secure: false,
            },
            preview: false,
            defaults: {
                from: '"Info" <dimatest01@gmail.com>',
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
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'jwtPayload',
            session: false,

        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '1d'
            }
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'src/config/schema.gql',
            formatError: (error: GraphQLError) => {
                const originalError: ErrorResponse = error.extensions?.originalError as ErrorResponse;
                const graphQLFormattedError: ErrorResponse = {
                    message: originalError?.message || error.message,
                    error: originalError?.error || 'INTERNAL_SERVER_ERROR',
                    statusCode: originalError?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
                };
                return graphQLFormattedError;
            }
        }),
    ],
    controllers: [
        AppController,
        ArticleController,
        TagController,
        ArticleSearchController,
        PushNotificationController,
        AuthController
    ],
    providers: [
        AppService,
        ArticleService,
        ArticleSearchService,
        SentryService,
        FileService,
        EmailService,
        ExcelService,
        AuthService,
        TagService,
        CronJobService,
        PushNotificationService,
        BasicStrategy,
        JwtStrategy,
        LocalStrategy,
        TagResolver,
        TagGQLService,
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}

export const SERVER_URL: string = process.env.SERVER_URL ?? '';
