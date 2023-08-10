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
import { In, Repository } from "typeorm";
import { PushNotificationService } from "src/endpoints/push-notification/push-notification.service";
import { ExcelService } from "src/services/excel.service";

@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>,
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleContentEntity) private readonly articleContentRepository: Repository<ArticleContentEntity>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly emailService: EmailService,
        private readonly excelService: ExcelService,
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

        // Previous query returns only tags for searched tagId (because we want to filter articles by tagId).
        // But we want to return articles with all their tags.
        // So we run another query to get articles from previous query with all their tags.
        if (tagId) {

            // Find all articles from previous query by ids, but now with all tags.
            const articlesWithTags: ArticleContentEntity[] = await this.articleContentRepository.find({
                where: { id: In(articleContentEntities.map(articleContent => articleContent.id)) },
                relations: { article: { tags: true } }
            });

            // Map tags to articleContentEntities tags.
            articleContentEntities.forEach(articleContent => {
                articleContent.article.tags = articlesWithTags.find(tag => tag.id === articleContent.id)?.article.tags ?? [];
            });
        }

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

    public async exportArticles(): Promise<Buffer> {
        const articles: ArticleContentEntity[] = await this.articleContentRepository.find({
            relations: ['article', 'article.tags']
        });

        return this.excelService.exportArticles(articles.map(article => new ArticleDto(article)));
    }

}
