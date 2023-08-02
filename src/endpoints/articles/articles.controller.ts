import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query, UseInterceptors, ValidationError, ValidationPipe } from '@nestjs/common';
import { LanguageEnum } from '../../models/enums/language.enum';
import { ArticleTypeEnum } from '../../models/enums/article-type.enum';
import { ArticlesService } from './articles.service';
import { CheckArticleType } from 'src/utils/pipes/check-article-type.pipe';
import { StringToNumberPipe } from 'src/utils/pipes/string-to-number.pipe';
import { ArticleDto } from 'src/models/dtos/article.dto';
import { ApiOperation } from '@nestjs/swagger';
import { BadValidationRequestException } from 'src/models/exceptions/bad-validation-request.exception';
import { ArticleRequestDto } from 'src/models/dtos/article-request.dto';

@Controller('articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) {
    }
    
    /**
     * API accept ArticleRequestDto from request. For each language creates new ArticleContent.
     * @param body          Article request body.
     */
    @HttpCode(200)
    @Post(':articleType')
    // Use interceptor if body is serverd as form-data.
    // @UseInterceptors(AnyFilesInterceptor())
    public savePressReleaseArticleFromStoryBoard(@Param('articleType', CheckArticleType) articleType: ArticleTypeEnum,
                                                 @Body(new ValidationPipe({
                                                     transform: true,
                                                     exceptionFactory: (errors: ValidationError[]) => new BadValidationRequestException(errors),
                                                 })) body: ArticleRequestDto): Promise<void> {
        return this.articlesService.createArticle(articleType, body);
    }

    /**
     * Get all articles by article type.
     * API returns object with infromation get from ArticleEntity and details about article from ArticleContentEntity.
     *
     * @param articleType   Type of article.
     * @param language      Content language.
     * @param page          Page (1, 2, 3, atd)
     * @param count         Number of articles per page.
     * @param tagId         If tagId is present, return only articles containing this tag.
     * @returns             list of articles.
     */
    @ApiOperation({ summary: 'Get all articles by article type.' })
    @Get(':articleType')
    public async getArticles(@Param('articleType', CheckArticleType) articleType: ArticleTypeEnum,
                             @Query('page', StringToNumberPipe) page: number,
                             @Query('count', StringToNumberPipe) count: number,
                             @Headers('x-language') language: LanguageEnum,
                             @Query('tagId') tagId: string): Promise<ArticleDto[]> {
        return this.articlesService.getArticlesByTypeAndFilter(articleType, language, page, count, tagId);
    }

    /**
     * API returns object with infromation get from ArticleEntity and details about article from ArticleContentEntity.
     * @param id 
     * @param language 
     * @returns article detail.
     */
    @ApiOperation({ summary: 'Get article by id.' })
    @Get('detail/:id')
    public async getArticleById(@Param('id', StringToNumberPipe) id: number,
                                @Headers('x-language') language: LanguageEnum): Promise<ArticleDto> {
        return this.articlesService.getArticleById(id, language);
    }

}
