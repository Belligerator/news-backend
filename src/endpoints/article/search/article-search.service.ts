import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DEFAULT_LANGUAGE, PAGE_COUNT } from "src/constants";
import { ArticleContentEntity } from "src/entities/article-content.entity";
import { ArticleDto } from "src/models/dtos/article.dto";
import { ArticleTypeEnum } from "src/models/enums/article-type.enum";
import { LanguageEnum } from "src/models/enums/language.enum";
import { Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class ArticleSearchService {

    constructor(
        @InjectRepository(ArticleContentEntity) private articleContentRepository: Repository<ArticleContentEntity>,
    ) { }

    /**
     * This method is used for searching articles by pattern in title or body.
     * @param pattern   Pattern to search.
     * @param language  Language of the article.
     * @param page      Pagination page.
     * @param count     Number of articles per page.
     * @returns         List of articles.
     */
    public async searchArticles(
        articleType: ArticleTypeEnum,
        pattern: string,
        language: LanguageEnum = DEFAULT_LANGUAGE,
        page: number = 1,
        count: number = PAGE_COUNT
    ): Promise<ArticleDto[]> {
        pattern = this.checkSearchPattern(pattern);

        // Cannot use find() because of the WHERE condition with OR operator.
        const sqlQuery: SelectQueryBuilder<ArticleContentEntity> = this.articleContentRepository
            .createQueryBuilder('content')
            .innerJoinAndSelect('content.article', 'article')
            .leftJoinAndSelect('article.tags', 'tags')
            .where('content.language = :language', { language })
            .andWhere('article.active = 1')
            .andWhere('article.articleType = :articleType', { articleType })
            .andWhere('(content.title LIKE :pattern OR content.body LIKE :pattern)', { pattern: `%${pattern}%` })
            .limit(count)
            .offset(page < 1 ? 0 : (page - 1) * count)
            .orderBy('date_of_publication', 'DESC');

        const articleContentEntities: ArticleContentEntity[] = await sqlQuery.getMany();
        return articleContentEntities.map(articleContent => new ArticleDto(articleContent));
    }

    /**
     * Method for searching articles for autocomplete. Search only in title. Return only id, title and dateOfPublication.
     * @param pattern   Pattern to search.
     * @param language  Language of the article.
     * @returns         Only id, title and dateOfPublication.
     */
    public async searchAutocompleteArticle(articleType: ArticleTypeEnum, pattern: string, language: LanguageEnum = DEFAULT_LANGUAGE ): Promise<ArticleDto[]> {
        pattern = this.checkSearchPattern(pattern);

        // Search only in title.
        // Return only id, title and dateOfPublication. It is enough for autocomplete.
        const queryBuilder: SelectQueryBuilder<ArticleContentEntity> = this.articleContentRepository
            .createQueryBuilder('content')
            .select('content.id', 'articleContentId')
            .addSelect('title')
            .addSelect('date_of_publication', 'dateOfPublication')
            .innerJoin('content.article', 'article')
            .where('language = :language', { language })
            .andWhere('article.articleType = :articleType', { articleType })
            .andWhere('title LIKE :pattern', { pattern: `%${pattern}%` })
            .limit(10)
            .orderBy('dateOfPublication', 'DESC');

        return await queryBuilder.getRawMany();
    }

    /**
     * This method is used for checking search pattern.
     * @throws BadRequestException  if pattern is missing.
     * @param pattern               Pattern to search.
     * @returns                     Pattern without unwanted white spaces.
     */
    private checkSearchPattern(pattern: string): string {
        if (!pattern) {
            throw new BadRequestException('Missing mandatory parameter(s): pattern.');
        }
        
        // Remove unwanted white spaces.
        return pattern.replace(/ +/g, ' ').trim();
    }
}