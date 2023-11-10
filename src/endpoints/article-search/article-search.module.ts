import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleContentEntity } from "../article/article-content.entity";
import { Module } from "@nestjs/common";
import { ArticleSearchController } from "./article-search.controller";
import { ArticleSearchService } from "./article-search.service";

@Module({
    imports: [TypeOrmModule.forFeature([ArticleContentEntity])],
    controllers: [ArticleSearchController],
    providers: [ArticleSearchService],
}) export class ArticleSearchModule { }
