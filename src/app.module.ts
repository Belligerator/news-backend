import { HttpStatus, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database-config';
import { ArticleEntity } from './endpoints/article/article.entity';
import { ArticleContentEntity } from './endpoints/article/article-content.entity';
import loggerConfig from './config/logger-config';
import { WinstonModule } from 'nest-winston';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { TagEntity } from './endpoints/tag/tag.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { PushTokenEntity } from './endpoints/push-notification/push-token.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BasicStrategy } from './endpoints/auth/strategies/basic.strategy';
import { JwtStrategy } from './endpoints/auth/strategies/jwt.strategy';
import { LocalStrategy } from './endpoints/auth/strategies/local.strategy';
import { UserEntity } from './endpoints/auth/user.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLError } from 'graphql';
import { ErrorResponse } from './models/dtos/error-response.dto';
import { CronJobModule } from './shared/services/cron-job/cron-job.module';
import { ArticleModule } from './endpoints/article/article.module';
import { AuthModule } from './endpoints/auth/auth.module';
import { PushNotificationModule } from './endpoints/push-notification/push-notification.module';
import { TagModule } from './endpoints/tag/tag.module';
import { TagGQLModule } from './graphql/tag-gql.module';
import { ArticleSearchModule } from './endpoints/article/search/article-search.module';
import { EmailModule } from './shared/services/email/email.module';
import { ExcelModule } from './shared/services/excel/excel.module';
import { FileModule } from './shared/services/file/file.module';
import { SentryModule } from './shared/services/sentry/sentry.module';
import { SERVER_URL } from './constants';

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
            isGlobal: true,
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
        CronJobModule,
        EmailModule,
        ExcelModule,
        FileModule,
        SentryModule,
        ArticleSearchModule,
        ArticleModule,
        AuthModule,
        PushNotificationModule,
        TagModule,
        TagGQLModule
    ],
    controllers: [
        AppController,
    ],
    providers: [
        AppService,
        BasicStrategy,
        JwtStrategy,
        LocalStrategy,
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
