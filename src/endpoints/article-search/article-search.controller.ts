import { Controller, Get, Headers, Param,Query, UseInterceptors } from '@nestjs/common';
import { CheckArticleTypePipe } from 'src/shared/pipes/check-article-type.pipe';
import { StringToNumberPipe } from 'src/shared/pipes/string-to-number.pipe';
import { ArticleDto } from 'src/endpoints/article/dto/article.dto';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleTypeEnum } from 'src/models/enums/article-type.enum';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { ArticleSearchService } from './article-search.service';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheKeyEnum } from 'src/models/enums/cache-key.enum';

@ApiTags('Administration', 'Application')
@UseInterceptors(CacheInterceptor)
@CacheKey(CacheKeyEnum.SEARCH)
@Controller('articles/search')
export class ArticleSearchController {

    constructor(private readonly articleSearchService: ArticleSearchService) {
    }

    /**
     * This API is used for searching articles by pattern in title or body.
     * 
     * @throws NotFoundException    if pattern is not present.
     * @param pattern   Pattern to search.
     * @param language  Language of the article.
     * @param page      Pagination page.
     * @param count     Number of articles per page.
     * @returns         List of articles.
     */
    @ApiOperation({ summary: 'Search articles by pattern in title or body.' })
    @ApiNotFoundResponse({ description: 'Pattern is not present.' })
    @Get(':articleType')
    public search(@Param('articleType', CheckArticleTypePipe) articleType: ArticleTypeEnum,
                  @Query('page', StringToNumberPipe) page: number,
                  @Query('count', StringToNumberPipe) count: number,
                  @Headers('x-language') language: LanguageEnum,
                  @Query('pattern') pattern: string): Promise<ArticleDto[]> {
        return this.articleSearchService.searchArticles(articleType, pattern, language, page, count);
    }

    /**
     * API for searching articles for autocomplete. Search only in title. Return only id, title and dateOfPublication.
     * 
     * @throws NotFoundException    if pattern is not present.
     * @param pattern   Pattern to search.
     * @param language  Language of the article.
     * @returns         Only id, title and dateOfPublication.
     */
    @ApiOperation({ summary: 'Search articles for autocomplete.' })
    @ApiNotFoundResponse({ description: 'Pattern is not present.' })
    @Get('autocomplete/:articleType')
    public searchAutocomplete(@Param('articleType', CheckArticleTypePipe) articleType: ArticleTypeEnum,
                              @Headers('x-language') language: LanguageEnum,
                              @Query('pattern') pattern: string): Promise<ArticleDto[]> {
        return this.articleSearchService.searchAutocompleteArticle(articleType, pattern, language);
    }

}
