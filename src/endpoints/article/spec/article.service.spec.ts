import { LanguageEnum } from 'src/models/enums/language.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailService } from 'src/shared/services/email/email.service';
import { PushNotificationService } from 'src/endpoints/push-notification/push-notification.service';
import { ExcelService } from 'src/shared/services/excel/excel.service';
import { ArticleEntity } from '../article.entity';
import { ArticleService } from '../article.service';
import { ArticleContentEntity } from '../article-content.entity';
import { TagEntity } from 'src/endpoints/tag/tag.entity';
import { ArticleTypeEnum } from 'src/models/enums/article-type.enum';
import { ArticleDto } from '../dto/article.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston/dist/winston.constants';
import { SentryService } from 'src/shared/services/sentry/sentry.service';
import { FileService } from 'src/shared/services/file/file.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ArticleRequestDto } from '../dto/article-request.dto';

const testArticleContentId: number = 1;
const testArticleType: ArticleTypeEnum = ArticleTypeEnum.NEWS;
const now: Date = new Date();

const testArticleContent: ArticleContentEntity = {
    id: testArticleContentId,
    articleId: 1,
    language: LanguageEnum.EN,
    title: 'title',
    body: 'body',
    coverImage: null,
    dateOfPublication: now,
    article: {
        id: 1,
        articleType: ArticleTypeEnum.NEWS,
        active: true,
        parent: null,
        timestamp: now,
    },
};

const newArticleDto: ArticleRequestDto = {
    title: { cs: 'Titulek', en: 'Title' },
    body: { cs: 'Český text', en: 'English text' },
    parent: null,
    coverImage: null,
    tags: JSON.stringify([{'id': 'sport'}]),
    dateOfPublication: now,
};

const tagsInDbById: TagEntity[] = [
    {
        id: 'sport',
        title: 'Sport',
        language: LanguageEnum.EN,
        order: 1,
    },
    {
        id: 'sport',
        title: 'Český sport',
        language: LanguageEnum.CS,
        order: 1,
    },
];

describe('ArticleService', () => {
    let articleService: ArticleService;
    let emailService: EmailService;
    let pushNotificationService: PushNotificationService;

    let articleContentRepository: Repository<ArticleContentEntity>;
    let articleContentRepositoryToken: string | Function = getRepositoryToken(ArticleContentEntity);

    let tagRepository: Repository<TagEntity>;
    let tagRepositoryToken: string | Function = getRepositoryToken(TagEntity);

    let articleRepository: Repository<ArticleEntity>;
    let articleRepositoryToken: string | Function = getRepositoryToken(ArticleEntity);

    beforeEach(async () => {
        jest.useFakeTimers();
        jest.setSystemTime(now);

        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                ArticleService,
                {
                    provide: FileService,
                    useValue: {
                        // Mock removing file from system.
                        removeFileFromSystem: jest.fn(),
                    }
                },
                {
                    provide: PushNotificationService,
                    useValue: {
                        // Mock sending push notification to topic.
                        sendPushNotificationToTopic: jest.fn(),
                    }
                },
                {
                    provide: SentryService,
                    useValue: {
                        captureException: jest.fn(),
                    }
                },
                {
                    provide: ExcelService,
                    useValue: {
                        // Mock generating excel file.
                        exportArticles: jest.fn(),
                    }
                },
                {
                    provide: EmailService,
                    useValue: {
                        // Mock sending email.
                        sendEmail: jest.fn(),
                    }
                },
                { 
                    provide: WINSTON_MODULE_PROVIDER,
                    useValue: {
                        log: jest.fn(),
                        error: jest.fn(),
                    } 
                },
                { 
                    provide: CACHE_MANAGER,
                    useValue: {
                        del: jest.fn(),
                    } 
                },
                {
                    provide: articleContentRepositoryToken,
                    useClass: Repository,
                },
                {
                    provide: tagRepositoryToken,
                    useValue: {
                        findBy: jest.fn().mockResolvedValue(Promise.resolve(tagsInDbById)),
                    },
                },
                {
                    provide: articleRepositoryToken,
                    useClass: Repository,
                },
            ],
        }).compile();

        articleService = app.get<ArticleService>(ArticleService);
        emailService = app.get<EmailService>(EmailService);
        pushNotificationService = app.get<PushNotificationService>(PushNotificationService);
        articleContentRepository = app.get<Repository<ArticleContentEntity>>(articleContentRepositoryToken);
        articleRepository = app.get<Repository<ArticleEntity>>(articleRepositoryToken);
        tagRepository = app.get<Repository<TagEntity>>(tagRepositoryToken);
    });

    it('should be defined', () => {
        expect(articleService).toBeDefined();
    });

    describe('createArticle', () => {

        it('should create article', async () => {
            
            const newArticleEntity: ArticleEntity = new ArticleEntity();
            newArticleEntity.articleType = testArticleType;
            newArticleEntity.active = true;
            newArticleEntity.parent = newArticleDto.parent;
            newArticleEntity.timestamp = now;
            newArticleEntity.tags = tagsInDbById;
    
            const articleContentCs: ArticleContentEntity = new ArticleContentEntity();
            articleContentCs.language = LanguageEnum.CS;
            articleContentCs.title = newArticleDto.title.cs!;
            articleContentCs.body = newArticleDto.body.cs!;
            articleContentCs.coverImage = newArticleDto.coverImage;
            articleContentCs.dateOfPublication = newArticleDto.dateOfPublication!;
            articleContentCs.article = newArticleEntity;
    
            const articleContentEn: ArticleContentEntity = new ArticleContentEntity();
            articleContentEn.language = LanguageEnum.EN;
            articleContentEn.title = newArticleDto.title.en!;
            articleContentEn.body = newArticleDto.body.en!;
            articleContentEn.coverImage = newArticleDto.coverImage;
            articleContentEn.dateOfPublication = newArticleDto.dateOfPublication!;
            articleContentEn.article = newArticleEntity;
    
            // Create article content entities for both languages.
            const newArticleContentEntities: ArticleContentEntity[] = [articleContentCs, articleContentEn];
    
            // I have to spy on save method because I need articleContentRepository in test module to be mocked.
            // I do not need resolved value, so just use something (articleContentCs) as a return value.
            // I cannot use newArticleContentEntities (array on entities), I do not know why.
            jest.spyOn(articleContentRepository, 'save').mockResolvedValueOnce(articleContentCs);
    
            await articleService.createArticle(testArticleType, newArticleDto);
    
            expect(articleContentRepository.save).toHaveBeenCalledWith(newArticleContentEntities);
            expect(emailService.sendEmail).toHaveBeenCalledWith(new ArticleDto(newArticleContentEntities[0]));
            expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
            // Call for every language.
            expect(pushNotificationService.sendPushNotificationToTopic).toHaveBeenCalledTimes(newArticleContentEntities.length);
        });

        it('should throw BadRequestException, because of bad JSON with tags in request', async () => {
        
            newArticleDto.tags = 'bad json';
    
            const result: Promise<void> = articleService.createArticle(testArticleType, newArticleDto);
            
            expect(result).rejects.toThrowError(BadRequestException);
    
        });
    
        it('should throw BadRequestException, body or title for language is missing in request', async () => {
            // Frontend send request as form data with fields for each language.
            // title[en] and title[cs] (same for body),
            // ArticleRequestDto and annotation @IsNotEmpty() is checking if there is mapped object 'title',
            // but it cannot check if there is mapped object 'title.cs' or 'title.en'.
            // So I have to check it in ArticleService.createArticle() method and this is test for it.
    
            // Test for title.
            delete newArticleDto.title.cs;
    
            const resultTitle: Promise<void> = articleService.createArticle(testArticleType, newArticleDto);
    
            expect(resultTitle).rejects.toThrowError(BadRequestException);
    
            // Test for body.
            newArticleDto.title.cs = 'Titulek';
            delete newArticleDto.body.cs;
    
            const resultBody: Promise<void> = articleService.createArticle(testArticleType, newArticleDto);
    
            expect(resultBody).rejects.toThrowError(BadRequestException);
    
        });

    });


    describe('createArticle', () => {

        it('should return article by id', async () => {

            jest.spyOn(articleContentRepository, 'findOne').mockResolvedValueOnce(testArticleContent);
    
            const result: ArticleDto = await articleService.getArticleById(testArticleContentId);
    
            expect(result).toEqual(new ArticleDto(testArticleContent));
            expect(articleContentRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: testArticleContentId,
                },
                relations: {
                    article: {
                        tags: true
                    }
                }
            });
    
        });
    
        it('should throw NotFoundException', async () => {
    
            jest.spyOn(articleContentRepository, 'findOne').mockResolvedValueOnce(null);
    
            const result: Promise<ArticleDto> = articleService.getArticleById(-1);
    
            expect(result).rejects.toThrowError(NotFoundException);
    
        });
    
    });

    afterAll(() => {
        jest.useRealTimers();
    });
    
});
