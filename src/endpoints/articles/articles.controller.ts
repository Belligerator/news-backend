import { Body, Controller, Get, Headers, HttpCode, Param, Post, Put, Query, UseInterceptors, ValidationError, ValidationPipe } from '@nestjs/common';
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
     * This method is used for searching articles by pattern in title or body.
     * 
     * @param pattern   Pattern to search.
     * @param language  Language of the article.
     * @param page      Pagination page.
     * @param count     Number of articles per page.
     * @returns         List of articles.
     */
    @ApiOperation({ summary: 'Search articles by pattern in title or body.' })
    @Get('search')
    public search(@Query('page', StringToNumberPipe) page: number,
                  @Query('count', StringToNumberPipe) count: number,
                  @Headers('x-language') language: LanguageEnum,
                  @Query('pattern') pattern: string): Promise<ArticleDto[]> {
        return this.articlesService.searchArticles(pattern, language, page, count);
    }

    /**
     * Method for searching articles for autocomplete. Search only in title. Return only id, title and dateOfPublication.
     * 
     * @param pattern   Pattern to search.
     * @param language  Language of the article.
     * @returns         Only id, title and dateOfPublication.
     */
    @ApiOperation({ summary: 'Search articles for autocomplete.' })
    @Get('search/autocomplete')
    public searchAutocomplete(@Headers('x-language') language: LanguageEnum,
                              @Query('pattern') pattern: string): Promise<ArticleDto[]> {
        return this.articlesService.searchAutocompleteArticle(pattern, language);
    }

    /**
     * API accept ArticleRequestDto from request. For each language creates new ArticleContent.
     * 
     * @param body          Article request body.
     */
    @ApiOperation({ summary: 'Create new article.' })
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
     * 
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

    /**
     * This API is used for updating article by id.
     * 
     * @throws NotFoundException    if article does not exist.
     * @param articleContentId      Id of the article content.  
     * @param body                  Article details.
     * @returns                     Updated article.
     */
    @ApiOperation({ summary: 'Update article by id.' })
    @Put(':id')
    public async updateArticleById(@Param('id', StringToNumberPipe) articleContentId: number,
                                   @Body() body: ArticleDto): Promise<ArticleDto> {
        return this.articlesService.updateArticleById(articleContentId, body);
    }

    /**
     * This API is used for updating article activity. Articles cannot be deleted, only deactivated.
     * Articles can be deactivated also via updateArticleById. But this API is for quick deactivation via administration.
     * 
     * @throws NotFoundException    if article does not exist.
     * @param articleContentId      Id of the article content.
     * @param activity              Activity of the article.
     */
    @ApiOperation({ summary: 'Set article activity.' })
    @Put(':id/activity')
    public async setArticleActivity(@Param('id', StringToNumberPipe) articleContentId: number,
                                    @Body('active') activity: boolean): Promise<void> {
        return this.articlesService.setArticleActivity(articleContentId, activity);
    }
}
