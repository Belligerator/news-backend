import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_LANGUAGE, PAGE_COUNT } from 'src/constants';
import { ArticleContentEntity } from 'src/endpoints/article/article-content.entity';
import { ArticleDto } from 'src/endpoints/article/dto/article.dto';
import { ArticleTypeEnum } from 'src/models/enums/article-type.enum';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { Raw, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class ArticleSearchService {

    constructor(
        @InjectRepository(ArticleContentEntity) private readonly articleContentRepository: Repository<ArticleContentEntity>,
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

        // Cannot use find() because of the WHERE condition with OR operator. https://github.com/typeorm/typeorm/issues/2869
        // We can use OR operator in find(), but we have to copy all where conditions. Eg.:
        /*
            where: [{
                    language,
                    article: { articleType },
                    title: ILike(`%${pattern}%`), <-- We cannot do (title LIKE :pattern OR body LIKE :pattern), we can check only one column.
                },
                {
                    language,
                    article: { articleType },
                    body: ILike(`%${pattern}%`),
                }],
        */
        // We cannot check both columns (title and body) in one where condition in find() function. So use queryBuilder.
        // However, there is a workaround. We can use Raw() function, but it is not very clean. See searchAutocompleteArticle() method.
        // title: Raw(() => `(ArticleContentEntity.title LIKE :pattern OR ArticleContentEntity.body LIKE :pattern)`, { pattern: `%${pattern}%` }),
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
        const articleContentEntities: ArticleContentEntity[] = await this.articleContentRepository.find({
            where: {
                language,
                article: { articleType, active: true },
                // Workaround for searching in two columns with find(). Use Entity.name variable in case it is refactored.
                title: Raw(() => `(${ArticleContentEntity.name}.title LIKE :pattern OR ${ArticleContentEntity.name}.body LIKE :pattern)`, { pattern: `%${pattern}%` }),
            },
            relations: ['article'],
            take: 10,
            order: { dateOfPublication: 'DESC' },
        });

        return articleContentEntities.map(articleContent => new ArticleDto(articleContent, true));
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