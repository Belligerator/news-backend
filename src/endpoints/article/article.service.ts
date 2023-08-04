import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { DEFAULT_LANGUAGE, PAGE_COUNT } from "src/constants";
import { ArticleContentEntity } from "src/entities/article-content.entity";
import { ArticleEntity } from "src/entities/article.entity";
import { TagEntity } from "src/entities/tag.entity";
import { ArticleRequestDto } from "src/models/dtos/article-request.dto";
import { ArticleDto } from "src/models/dtos/article.dto";
import { ArticleTypeEnum } from "src/models/enums/article-type.enum";
import { LanguageEnum } from "src/models/enums/language.enum";
import { EmailService } from "src/services/email.service";
import { FileService } from "src/services/file.service";
import { In, Repository, SelectQueryBuilder } from "typeorm";
import { PushNotificationService } from "../push-notification/push-notification.service";

@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>,
        @InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleContentEntity) private articleContentRepository: Repository<ArticleContentEntity>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly emailService: EmailService,
        private readonly pushNotificationService: PushNotificationService,
        private readonly fileService: FileService
    ) { }

    /**
     * This method is used for creating new article.
     * @param articleType   Type of article.
     * @param newArticleDto Article details.
     */
    public async createArticle(articleType: ArticleTypeEnum, newArticleDto: ArticleRequestDto): Promise<void> {
        this.logger.log('info', `[STORYBOARD_ARTICLE_SERVICE] Article=${JSON.stringify(newArticleDto)}`);

        // Title is mandatory, we will take from it what languages are in the request.
        const languages: string [] = Object.keys(newArticleDto.title) as Array<keyof typeof newArticleDto.title>;

        // Create new article.
        const newArticle: ArticleEntity = new ArticleEntity();
        newArticle.articleType = articleType;
        newArticle.parent = newArticleDto.parent;

        // Parse tags from request.
        let tagsFromDto: TagEntity[] = [];
        try {
            tagsFromDto = JSON.parse(newArticleDto.tags);
        } catch(e) {
            this.logger.error(`[STORYBOARD_ARTICLE_SERVICE] Cannot parse tags from request. ${e}`);
            throw new BadRequestException(`Cannot parse tags from request. ${newArticleDto.tags}`);
        }

        // Find tags from database by ids from request.
        newArticle.tags = await this.tagRepository.findBy({
            id: In(tagsFromDto.map(tag => tag.id))
        });

        // Create new article content for each language.
        const newArticleContentEntities: ArticleContentEntity[] = languages.map((language: keyof typeof newArticleDto.title) => {
            const newArticleContent: ArticleContentEntity = new ArticleContentEntity();
            newArticleContent.title = newArticleDto.title[language];
            newArticleContent.body = newArticleDto.body[language];
            newArticleContent.language = <LanguageEnum> language;
            newArticleContent.dateOfPublication = newArticleDto.dateOfPublication ?? new Date();
            newArticleContent.article = newArticle;
            newArticleContent.coverImage = newArticleDto.coverImage;

            if (!newArticleContent.title) {
                throw new BadRequestException(`Missing mandatory parameter(s): title for language ${language}.`);
            }
            
            if (!newArticleContent.body) {
                throw new BadRequestException(`Missing mandatory parameter(s): body for language ${language}.`);
            }
            return newArticleContent;
        });

        await this.articleContentRepository.save(newArticleContentEntities);

        // Send email about new article.
        // This feature is just for testing purposes, so pick first language.
        this.emailService.sendEmail(new ArticleDto(newArticleContentEntities[0]));

        // Send push notification about new article for every language.
        newArticleContentEntities.forEach(item => {
            this.pushNotificationService.sendPushNotificationToTopic(item, item.language);
        });
        
    }

    /**
     * This method is used for getting articles by type and tag.
     * @param articleType   Type of article.
     * @param language      Content language.
     * @param page          Pagination page.
     * @param count         Number of articles per page.
     * @param tagId         If tagId is present, return only articles containing this tag.
     * @returns             List of articles filtered by type and tag.
     */
    public async getArticlesByTypeAndFilter(
        articleType: ArticleTypeEnum,
        language: LanguageEnum = DEFAULT_LANGUAGE,
        page: number = 1,
        count: number = PAGE_COUNT,
        tagId?: string
    ): Promise<ArticleDto[]> {

        const articleContentEntities: ArticleContentEntity[] = await this.articleContentRepository.find({
            where: {
                language: language,
                article: {
                    active: true,
                    articleType: articleType,
                    tags: tagId ? {
                        language: language,
                        id: tagId
                    } : undefined
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

    /**
     * This method is used for getting article by id.
     * @param articleContentId  Id of the article content.
     * @param language          Language of the article.
     * @returns                 Article with details.
     */
    public async getArticleById(articleContentId: number, language: LanguageEnum = DEFAULT_LANGUAGE): Promise<ArticleDto> {

        const articleContentEntity: ArticleContentEntity | null = await this.articleContentRepository.findOne({
            where: {
                id: articleContentId,
                article: {
                    tags: {
                        language: language
                    }
                }
            },
            relations: {
                article: {
                    tags: true
                }
            }
        });

        if (!articleContentEntity) {
            throw new NotFoundException(`Article with id ${articleContentId} not found.`);
        }

        return new ArticleDto(articleContentEntity);
    }
    
    /**
     * This method is used for updating article by id.
     * @throws NotFoundException    if article does not exist.
     * @param articleContentId      Id of the article content.  
     * @param updatedArticle        Article details.
     * @returns                     Updated article.
     */
    public async updateArticleById(articleContentId: number, updatedArticle: ArticleDto): Promise<ArticleDto> {
        
        const oldArticleContentEntity: ArticleContentEntity | null = await this.articleContentRepository.findOne({
            where: {
                id: articleContentId
            },
            relations: {
                article: {
                    tags: true
                }
            }
        });

        if (!oldArticleContentEntity) {
            throw new NotFoundException(`Article with id ${articleContentId} not found.`);
        }

        // Update oldArticleContentEntity with data from body.
        oldArticleContentEntity.title = updatedArticle.title;
        oldArticleContentEntity.body = updatedArticle.body;
        oldArticleContentEntity.dateOfPublication = updatedArticle.dateOfPublication ?? new Date();
        oldArticleContentEntity.article.parent = updatedArticle.parent;
        oldArticleContentEntity.article.active = updatedArticle.active;

        if (updatedArticle.updatedTags) {
            // Parse tags from request form.
            let tagsFromDto: TagEntity[] = [];
            try {
                tagsFromDto = JSON.parse(updatedArticle.updatedTags);
            } catch(e) {
                this.logger.error(`[STORYBOARD_ARTICLE_SERVICE] Cannot parse tags from request. ${e}`);
                throw new BadRequestException(`Cannot parse tags from request. ${updatedArticle.updatedTags}`);
            }

            // Find tags from database by ids from request.
            oldArticleContentEntity.article.tags = await this.tagRepository.findBy({ 
                id: In(tagsFromDto.map(tag => tag.id)) 
            });
        } else {
            // If tags are not present, remove all tags from article.
            oldArticleContentEntity.article.tags = [];
        }

        let coverImageToDelete: string | null = null;

        // If cover image is present, update it.
        if (updatedArticle.coverImage) {
            // If cover image is updated, delete old one.
            coverImageToDelete = oldArticleContentEntity.coverImage;

            // New cover image.
            oldArticleContentEntity.coverImage = updatedArticle.coverImage;
        } else if (updatedArticle.coverImage === '') {

            // If cover image is unset, delete it.
            coverImageToDelete = oldArticleContentEntity.coverImage;
            oldArticleContentEntity.coverImage = null;
        }

        const newArticleContentEntity: ArticleContentEntity = await this.articleContentRepository.save(oldArticleContentEntity);

        // New entity is saved, we can remove old cover image.
        // Do not await, we do not want to wait for this operation.
        if (coverImageToDelete) {
            this.fileService.removeFileFromSystem(coverImageToDelete);
        }

        return new ArticleDto(newArticleContentEntity);
    }
    
    /**
     * This method is used for updating article activity.
     * 
     * @throws NotFoundException    if article does not exist.
     * @param articleContentId  Id of the article content.
     * @param activity          Activity of the article.
     */
    public async setArticleActivity(articleContentId: number, activity: boolean): Promise<void> {
        
        const articleContentEntity: ArticleContentEntity | null = await this.articleContentRepository.findOne({
            where: {
                id: articleContentId
            },
            relations: {
                article: true
            }
        });

        if (!articleContentEntity) {
            throw new NotFoundException(`Article with id ${articleContentId} not found.`);
        }

        await this.articleRepository.update(articleContentEntity.article.id, { active: activity });
    }

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
