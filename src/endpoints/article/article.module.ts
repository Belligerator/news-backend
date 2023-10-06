import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { TagEntity } from "../tag/tag.entity";
import { ArticleEntity } from "./article.entity";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { ArticleContentEntity } from "./article-content.entity";
import { PushNotificationModule } from "../push-notification/push-notification.module";
import { EmailModule } from "src/shared/services/email/email.module";
import { ExcelModule } from "src/shared/services/excel/excel.module";
import { FileModule } from "src/shared/services/file/file.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TagEntity,
            ArticleEntity,
            ArticleContentEntity
        ]),
        EmailModule,
        ExcelModule,
        PushNotificationModule,
        FileModule
    ],
    controllers: [ArticleController],
    providers: [ArticleService],
}) export class ArticleModule { }
