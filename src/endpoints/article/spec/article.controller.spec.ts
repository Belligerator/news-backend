import { LanguageEnum } from 'src/models/enums/language.enum';
import { TagDto } from 'src/endpoints/tag/dto/tag.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DEFAULT_LANGUAGE } from 'src/constants';
import { ArticleService } from '../article.service';
import { ArticleController } from '../article.controller';
import { FileService } from 'src/shared/services/file/file.service';
import { ArticleDto } from '../dto/article.dto';
import { ArticleTypeEnum } from 'src/models/enums/article-type.enum';
import { ArticleContentEntity } from '../article-content.entity';
import { ArticleRequestDto } from '../dto/article-request.dto';
import { UploadedFileDto } from 'src/models/dtos/uploaded-file.dto';

describe('ArticleController', () => {
    let articleController: ArticleController;
    let articleService: ArticleService;
    let fileService: FileService;
    let testArticleContentDto: ArticleDto;
    let testArticleContent: ArticleContentEntity;
    let articleRequestBody: ArticleRequestDto;
    
    const testArticleType: ArticleTypeEnum = ArticleTypeEnum.NEWS;
    const testArticleLanguage: LanguageEnum = LanguageEnum.EN;
    const now: Date = new Date();
    
    const file: UploadedFileDto = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 100,
        destination: 'uploads',
        filename: 'test.jpg',
        path: 'uploads/test.jpg',
        buffer: Buffer.from('test'),
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ArticleController],
            providers: [
                { provide: CACHE_MANAGER, useValue: {} },
                {
                    provide: ArticleService,
                    useValue: {
                        createArticle: jest.fn().mockResolvedValue(null),
                        getArticlesByTypeAndFilter: jest.fn().mockResolvedValue([testArticleContentDto]),
                        getArticleById: jest.fn().mockResolvedValue(testArticleContentDto),
                        updateArticleById: jest.fn(),
                        setArticleActivity: jest.fn(),
                        exportArticles: jest.fn(),
                    },
                },
                {
                    provide: FileService,
                    useValue: {
                        resizeImage: jest.fn(),
                        removeFileFromSystem: jest.fn(),
                    }
                },
            ],
        }).compile();

        articleController = app.get<ArticleController>(ArticleController);
        articleService = app.get<ArticleService>(ArticleService);
        fileService = app.get<FileService>(FileService);

        testArticleContent = {
            id: 1,
            articleId: 1,
            language: testArticleLanguage,
            title: 'title',
            body: 'body',
            coverImage: null,
            dateOfPublication: now,
            article: {
                id: 1,
                articleType: testArticleType,
                active: true,
                parent: null,
                timestamp: now,
                tags: []
            },
        };

        testArticleContentDto = {
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

        articleRequestBody = {
            title: { cs: 'Titulek', en: 'Title' },
            body: { cs: 'Český text', en: 'English text' },
            parent: null,
            coverImage: null,
            tags: JSON.stringify([{'id': 'sport'}]),
            dateOfPublication: now,
        };
    });

    it('should be defined', () => {
        expect(articleController).toBeDefined();
    });

    describe('getArticles', () => {
        it('should return all articles by article type and filter', async () => {

            const result: ArticleDto[] = await articleController.getArticles(ArticleTypeEnum.NEWS, 1, 10, LanguageEnum.EN, undefined);

            expect(result).toEqual([testArticleContentDto]);

            expect(articleService.getArticlesByTypeAndFilter).toHaveBeenCalledWith(ArticleTypeEnum.NEWS, LanguageEnum.EN, 1, 10, undefined);

        });
    });
    
    describe('getArticleById', () => {
        it('should return article by id', async () => {

            const result: ArticleDto = await articleController.getArticleById(1);

            expect(result).toEqual(testArticleContentDto);

            expect(articleService.getArticleById).toHaveBeenCalledWith(1);

        });
    });
    
    describe('createArticle', () => {

        it('should create article with cover image (file)', async () => {

            await articleController.createArticle(testArticleType, {...articleRequestBody}, file);

            expect(fileService.resizeImage).toHaveBeenCalledWith(file.path);

            expect(articleService.createArticle).toHaveBeenCalledWith(testArticleType, {
                ...articleRequestBody,
                coverImage: `${file.destination}/${file.filename}`,
            });

        });

        it('should throw an Error', async () => {

            const someError: Error = new Error('Some error');

            jest.spyOn(articleService, 'createArticle').mockRejectedValueOnce(someError);

            const result: Promise<void> = articleController.createArticle(testArticleType, {...articleRequestBody}, file);

            expect(result).rejects.toThrowError(someError);

        });
    });
        
    describe('updateArticleById', () => {

        it('should update article by id', async () => {
            testArticleContentDto.title = 'Updated title';

            jest.spyOn(articleService, 'updateArticleById').mockResolvedValueOnce(testArticleContentDto);

            const result: ArticleDto = await articleController.updateArticleById(1, testArticleContentDto, file);

            expect(result).toEqual(testArticleContentDto);
            expect(fileService.resizeImage).toHaveBeenCalledWith(file.path);
            expect(articleService.updateArticleById).toHaveBeenCalledWith(1, {
                ...testArticleContentDto,
                coverImage: `${file.destination}/${file.filename}`,
            });

        });

        it('should throw an Error', async () => {

            const someError: Error = new Error('Some error');

            jest.spyOn(articleService, 'updateArticleById').mockRejectedValueOnce(someError);

            const result: Promise<ArticleDto> = articleController.updateArticleById(1, testArticleContentDto, file);

            expect(result).rejects.toThrowError(someError);

        });
    });

    describe('setArticleActivity', () => {

        it('should update article activity', async () => {

            await articleController.setArticleActivity(1, true);

            expect(articleService.setArticleActivity).toHaveBeenCalledWith(1, true);

        });
    });
});
