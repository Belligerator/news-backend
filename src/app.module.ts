import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database-config';
import { ArticleEntity } from './entities/article.entity';
import { ArticleContentEntity } from './entities/article-content.entity';
import { ArticlesController } from './endpoints/articles/articles.controller';
import { ArticlesService } from './endpoints/articles/articles.service';
import loggerConfig from './config/logger-config';
import { WinstonModule } from 'nest-winston';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import { TagEntity } from './entities/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([
      ArticleEntity,
      ArticleContentEntity,
      TagEntity
    ]),
    WinstonModule.forRoot(loggerConfig)
  ],
  controllers: [
    AppController,
    ArticlesController
  ],
  providers: [
    AppService,
    ArticlesService,
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
