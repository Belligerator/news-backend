import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleContentEntity } from "src/entities/article-content.entity";
import { ArticleEntity } from "src/entities/article.entity";
import { ArticleDto } from "src/models/dtos/article.dto";
import { ArticleTypeEnum } from "src/models/enums/article-type.enum";
import { LanguageEnum } from "src/models/enums/language.enum";
import { Repository } from "typeorm";

@Injectable()
export class ArticlesService {

    constructor(
        @InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleContentEntity) private articleContentRepository: Repository<ArticleContentEntity>,
    ) {}

    public async getArticlesByTypeAndFilter(
        articleType: ArticleTypeEnum,
        language: LanguageEnum = LanguageEnum.CS,
        page: number = 1,
        count: number = 10,
        tagId?: string
    ): Promise<ArticleDto[]> {

        const articleContentEntities: ArticleContentEntity[] = await this.articleContentRepository.find({
            where: {
                language: language,
                article: {
                    active: true,
                    articleType: articleType,
                    tags: { 
                        language: language,
                        id: tagId 
                    }
                }
            },
            relations: {
                article: { 
                    tags: true
                }
            },
            skip: (page < 1 ? 0 : (page - 1) * count),
            take: count,
            order: { dateOfPublication: 'DESC' }
        });

        return articleContentEntities.map(articleContent => new ArticleDto(articleContent));
    }

}
