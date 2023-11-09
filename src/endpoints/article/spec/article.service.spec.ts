import { LanguageEnum } from 'src/models/enums/language.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { In, Repository } from 'typeorm';
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
const testArticleLanguage: LanguageEnum = LanguageEnum.EN;
const now: Date = new Date();
const tagId: string = 'sport';

const tagsInDbById: TagEntity[] = [
    {
        id: tagId,
        title: 'Sport',
        language: LanguageEnum.EN,
        order: 1,
    },
    {
        id: tagId,
        title: 'Český sport',
        language: LanguageEnum.CS,
        order: 1,
    },
];

const testArticleContent: ArticleContentEntity = {
    id: testArticleContentId,
    articleId: 1,
    language: testArticleLanguage,
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
        tags: [{
            id: tagId,
            title: 'Sport',
            language: LanguageEnum.EN,
            order: 1,
        }]
    },
};

// DTO from testArticleContent entity above.
const testArticleContentDto: ArticleDto = {
    articleContentId: testArticleContent.id,
    title: testArticleContent.title,
    dateOfPublication: testArticleContent.dateOfPublication,
    articleType: testArticleContent.article.articleType,
    language: testArticleContent.language,
    body: testArticleContent.body,
    active: testArticleContent.article.active,
    parent: testArticleContent.article.parent,
    coverImage: testArticleContent.coverImage,
    tags: testArticleContent.article.tags ?? [],
};

const testArticleContent2: ArticleContentEntity = {
    id: 2,
    articleId: 2,
    language: testArticleLanguage,
    title: 'title 2',
    body: 'body 2',
    coverImage: null,
    dateOfPublication: now,
    article: {
        id: 2,
        articleType: ArticleTypeEnum.NEWS,
        active: true,
        parent: null,
        timestamp: now,
        tags: [{
            id: tagId,
            title: 'Sport',
            language: LanguageEnum.EN,
            order: 1,
        }]
    },
};

// DTO from testArticleContent2 entity above.
const testArticleContentDto2: ArticleDto = {
    articleContentId: testArticleContent2.id,
    title: testArticleContent2.title,
    dateOfPublication: testArticleContent2.dateOfPublication,
    articleType: testArticleContent2.article.articleType,
    language: testArticleContent2.language,
    body: testArticleContent2.body,
    active: testArticleContent2.article.active,
    parent: testArticleContent2.article.parent,
    coverImage: testArticleContent2.coverImage,
    tags: testArticleContent2.article.tags ?? [],
};

const updatedArticleContent: ArticleContentEntity = {
    id: testArticleContent.id,
    articleId: testArticleContent.articleId,
    language: testArticleContent.language,
    title: 'updated title',
    body: 'updated body',
    coverImage: null,
    dateOfPublication: now,
    article: {
        id: 1,
        articleType: ArticleTypeEnum.NEWS,
        active: false,
        parent: null,
        timestamp: now,
        tags: [{
            id: tagId,
            title: 'Sport',
            language: LanguageEnum.EN,
            order: 1,
        }]
    },
};

// DTO from updatedArticleContent entity above.
const updatedArticleContentDto: ArticleDto = {
    articleContentId: updatedArticleContent.id,
    title: updatedArticleContent.title,
    dateOfPublication: updatedArticleContent.dateOfPublication,
    articleType: updatedArticleContent.article.articleType,
    language: updatedArticleContent.language,
    body: updatedArticleContent.body,
    active: updatedArticleContent.article.active,
    parent: updatedArticleContent.article.parent,
    coverImage: updatedArticleContent.coverImage,
    tags: updatedArticleContent.article.tags ?? [],
    updatedTags: JSON.stringify([{'id': tagId}]),
};

// Repository save parameter for updated article.
const repositorySaveParameter: ArticleContentEntity = {
    id: testArticleContent.id,
    articleId: testArticleContent.articleId,
    language: testArticleContent.language,
    // By default, only these properties can be changed.
    // We can also change coverImage and tags, but we do not do it in this test.
    title: updatedArticleContentDto.title,
    body: updatedArticleContentDto.body,
    dateOfPublication: updatedArticleContentDto.dateOfPublication,
    coverImage: testArticleContent.coverImage,
    article: {
        articleType: testArticleContent.article.articleType,
        id: testArticleContent.article.id,
        timestamp: testArticleContent.article.timestamp,
        tags: tagsInDbById,
        // By default, only these properties can be changed.
        // We can also change coverImage and tags, but we do not do it in this test.
        active: updatedArticleContentDto.active,
        parent: updatedArticleContentDto.parent,
    },
};

const testArticleContentList: ArticleContentEntity[] = [
    testArticleContent,
    testArticleContent2,
];

const testArticleContentListDto: ArticleDto[] = [
    testArticleContentDto,
    testArticleContentDto2,
];

const newArticleDto: ArticleRequestDto = {
    title: { cs: 'Titulek', en: 'Title' },
    body: { cs: 'Český text', en: 'English text' },
    parent: null,
    coverImage: null,
    tags: JSON.stringify([{'id': tagId}]),
    dateOfPublication: now,
};

describe('ArticleService', () => {
    let articleService: ArticleService;
    let emailService: EmailService;
    let pushNotificationService: PushNotificationService;
    let fileService: FileService;

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
        fileService = app.get<FileService>(FileService);
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
    
            expect(result).toEqual(testArticleContentDto);
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

    describe('getArticlesByTypeAndFilter', () => {
        it('should return articles by type (no filter by tags)', async () => {

            jest.spyOn(articleContentRepository, 'find').mockResolvedValueOnce(testArticleContentList);
    
            const page: number = 1;
            const count: number = 10;

            const result: ArticleDto[] = await articleService.getArticlesByTypeAndFilter(
                testArticleType,
                testArticleLanguage,
                page,
                count,
                undefined
            );

            expect(result).toEqual(testArticleContentListDto);
            expect(articleContentRepository.find).toHaveBeenCalledWith({
                where: {
                    language: testArticleLanguage,
                    article: {
                        active: true,
                        articleType: testArticleType,
                        tags: undefined
                    }
                },
                relations: {
                    article: {
                        tags: true
                    }
                },
                skip: (page < 1 ? 0 : (page - 1) * count),
                take: count,
                // Sort from newest to oldest.
                order: { dateOfPublication: 'DESC' }
            });
    
        });

        it('should return articles by type (with filter by tags - has results)', async () => {

            jest.spyOn(articleContentRepository, 'find')
                .mockResolvedValueOnce(testArticleContentList)
                .mockResolvedValueOnce(testArticleContentList);
    
            const page: number = 1;
            const count: number = 10;

            const result: ArticleDto[] = await articleService.getArticlesByTypeAndFilter(
                testArticleType,
                testArticleLanguage,
                page,
                count,
                tagId
            );
    
            expect(result).toEqual(testArticleContentListDto);
            expect(articleContentRepository.find).toHaveBeenNthCalledWith(1, {
                where: {
                    language: testArticleLanguage,
                    article: {
                        active: true,
                        articleType: testArticleType,
                        tags: {
                            id: tagId,
                            language: testArticleLanguage
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
                // Sort from newest to oldest.
                order: { dateOfPublication: 'DESC' }
            });
    
            expect(articleContentRepository.find).toHaveBeenNthCalledWith(2, {
                where: { id: In([1, 2]) },
                relations: { article: { tags: true } }
            })
        });

        it('should return articles by type (with filter by tags - no results)', async () => {

            jest.spyOn(articleContentRepository, 'find')
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([]);
    
            const page: number = 1;
            const count: number = 10;

            const result: ArticleDto[] = await articleService.getArticlesByTypeAndFilter(
                testArticleType,
                testArticleLanguage,
                page,
                count,
                'unknown-tag'
            );
    
            expect(result).toEqual([]);
            expect(articleContentRepository.find).toHaveBeenCalledTimes(2);
            expect(articleContentRepository.find).toHaveBeenNthCalledWith(2, {
                where: { id: In([]) },
                relations: { article: { tags: true } }
            })
        });
    });

    describe('updateArticleById', () => {

        it('should update article (update/set also tags)', async () => {

            jest.spyOn(articleContentRepository, 'findOne').mockResolvedValueOnce(testArticleContent);
            jest.spyOn(articleContentRepository, 'save').mockResolvedValueOnce(updatedArticleContent);
            
            const result: ArticleDto = await articleService.updateArticleById(testArticleContentId, {
                ...updatedArticleContentDto,
                // Id should be ignored.
                articleContentId: -1,
            });

            expect(result).toEqual({
                ...updatedArticleContentDto,
                // This property is not in result.
                updatedTags: undefined,
            });

            expect(articleContentRepository.findOne).toHaveBeenCalledTimes(1);
            expect(articleContentRepository.save).toHaveBeenCalledTimes(1);
            // If received value contains id: -1, then it means that id was not ignored.
            expect(articleContentRepository.save).toHaveBeenCalledWith(repositorySaveParameter);
        });

        it('should throw NotFoundException (article not found by id)', async () => {

            jest.spyOn(articleContentRepository, 'findOne').mockResolvedValueOnce(null);
            
            const result: Promise<ArticleDto> = articleService.updateArticleById(testArticleContentId, updatedArticleContentDto);

            expect(result).rejects.toThrowError(NotFoundException);
            
        });

        it('should update article - remove all tags', async () => {

            jest.spyOn(articleContentRepository, 'findOne').mockResolvedValueOnce(testArticleContent);
            jest.spyOn(articleContentRepository, 'save').mockResolvedValueOnce({
                ...updatedArticleContent,
                article: {
                    ...updatedArticleContent.article,
                    tags: []
                }
            });
            
            // If updatedTags is set to undefined, then tags should be removed.
            const result: ArticleDto = await articleService.updateArticleById(testArticleContentId, {
                ...updatedArticleContentDto,
                updatedTags: undefined
            });

            // Tags should be removed.
            expect(result.tags).toEqual([]);
            expect(articleContentRepository.findOne).toHaveBeenCalledTimes(1);
            expect(articleContentRepository.save).toHaveBeenCalledTimes(1);
            expect(articleContentRepository.save).toHaveBeenCalledWith({
                ...repositorySaveParameter,
                article: {
                    ...repositorySaveParameter.article,
                    // Tags should be removed.
                    tags: [],
                }
            });
            expect(articleContentRepository.save).toHaveBeenCalledWith({
                articleId: testArticleContent.articleId,
                language: testArticleContent.language,
                coverImage: testArticleContent.coverImage,
                id: testArticleContent.id,
                title: updatedArticleContentDto.title,
                body: updatedArticleContentDto.body,
                dateOfPublication: updatedArticleContentDto.dateOfPublication,
                article: {
                    articleType: testArticleContent.article.articleType,
                    id: testArticleContent.article.id,
                    timestamp: testArticleContent.article.timestamp,
                    active: updatedArticleContentDto.active,
                    parent: updatedArticleContentDto.parent,
                    // Tags should be removed.
                    tags: [],
                },
            });
        });

        it('should update article - remove cover image', async () => {

            jest.spyOn(articleContentRepository, 'findOne').mockResolvedValueOnce({
                ...testArticleContent,
                coverImage: 'old-cover-image'
            });
            jest.spyOn(articleContentRepository, 'save').mockResolvedValueOnce({
                ...updatedArticleContent,
                coverImage: null
            });
            console.log(updatedArticleContentDto);
            const result: ArticleDto = await articleService.updateArticleById(testArticleContentId, {
                ...updatedArticleContentDto,
                coverImage: ''
            });
    
            // Cover image should be removed.
            expect(result.coverImage).toEqual(null);
            expect(articleContentRepository.findOne).toHaveBeenCalledTimes(1);
            expect(articleContentRepository.save).toHaveBeenCalledTimes(1);
            expect(articleContentRepository.save).toHaveBeenCalledWith({
                ...repositorySaveParameter,
                // Cover image should be removed.
                coverImage: null,
            });
            
            expect(fileService.removeFileFromSystem).toHaveBeenCalledTimes(1);
            expect(fileService.removeFileFromSystem).toHaveBeenCalledWith('old-cover-image');
        });

        it('should update article - update cover image', async () => {

            jest.spyOn(articleContentRepository, 'findOne').mockResolvedValueOnce({
                ...testArticleContent,
                coverImage: 'old-cover-image'
            });
            jest.spyOn(articleContentRepository, 'save').mockResolvedValueOnce({
                ...updatedArticleContent,
                coverImage: 'new-cover-image'
            });
            
            const result: ArticleDto = await articleService.updateArticleById(testArticleContentId, {
                ...updatedArticleContentDto,
                coverImage: 'new-cover-image',
            });

            // Cover image should be updated.
            expect(result.coverImage).toEqual('new-cover-image');
            expect(articleContentRepository.findOne).toHaveBeenCalledTimes(1);
            expect(articleContentRepository.save).toHaveBeenCalledTimes(1);
            expect(articleContentRepository.save).toHaveBeenCalledWith({
                ...repositorySaveParameter,
                // Cover image should be updated.
                coverImage: 'new-cover-image',
            });
            expect(fileService.removeFileFromSystem).toHaveBeenCalledTimes(1);
            expect(fileService.removeFileFromSystem).toHaveBeenCalledWith('old-cover-image');
        });
    });

    afterAll(() => {
        jest.useRealTimers();
    });
    
});
