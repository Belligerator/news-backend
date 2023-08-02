import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ArticleContentEntity } from "src/entities/article-content.entity";
import { ArticleEntity } from "src/entities/article.entity";
import { TagEntity } from "src/entities/tag.entity";
import { ArticleRequestDto } from "src/models/dtos/article-request.dto";
import { ArticleDto } from "src/models/dtos/article.dto";
import { ArticleTypeEnum } from "src/models/enums/article-type.enum";
import { LanguageEnum } from "src/models/enums/language.enum";
import { In, Logger, Repository } from "typeorm";

@Injectable()
export class ArticlesService {

    constructor(
        @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>,
        @InjectRepository(ArticleEntity) private articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleContentEntity) private articleContentRepository: Repository<ArticleContentEntity>,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) { }

    public async createArticle(articleType: ArticleTypeEnum, newArticleDto: ArticleRequestDto): Promise<void> {
        this.logger.log('info', `[STORYBOARD_ARTICLE_SERVICE] Article=${JSON.stringify(newArticleDto)}`);

        // Title is mandatory, we will take from it what languages are in the request.
        const languages: string [] = Object.keys(newArticleDto.title) as Array<keyof typeof newArticleDto.title>;

        // Create new article.
        const newArticle: ArticleEntity = new ArticleEntity();
        newArticle.articleType = articleType;
        newArticle.parent = newArticleDto.parent;

        // Find tags from database by id from request.
        newArticle.tags = await this.tagRepository.findBy({ id: In(newArticleDto.tags.map(tag => tag.id)) });

        // Create new article content for each language.
        const newArticleContentEntities: ArticleContentEntity[] = languages.map((language: keyof typeof newArticleDto.title) => {
            const newArticleContent: ArticleContentEntity = new ArticleContentEntity();
            newArticleContent.title = newArticleDto.title[language];
            newArticleContent.body = newArticleDto.body[language];
            newArticleContent.language = <LanguageEnum> language;
            newArticleContent.dateOfPublication = newArticleDto.dateOfPublication ?? new Date();
            newArticleContent.article = newArticle;

            if (!newArticleContent.title) {
                throw new BadRequestException(`Missing mandatory parameter(s): title for language ${language}.`);
            }
            
            if (!newArticleContent.body) {
                throw new BadRequestException(`Missing mandatory parameter(s): body for language ${language}.`);
            }
            return newArticleContent;
        });

        await this.articleContentRepository.save(newArticleContentEntities);
    }

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

    public async getArticleById(articleContentId: number, language: LanguageEnum = LanguageEnum.CS): Promise<ArticleDto> {

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
    
}
