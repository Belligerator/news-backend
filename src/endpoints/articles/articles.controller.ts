import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { LanguageEnum } from '../../models/enums/language.enum';
import { ArticleTypeEnum } from '../../models/enums/article-type.enum';
import { ArticlesService } from './articles.service';
import { CheckArticleType } from 'src/utils/pipes/check-article-type.pipe';
import { StringToNumberPipe } from 'src/utils/pipes/string-to-number.pipe';
import { ArticleDto } from 'src/models/dtos/article.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('articles')
export class ArticlesController {

    constructor(private readonly articlesService: ArticlesService) {
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
     */
    @ApiOperation( { summary: 'Get all articles by article type.' })
    @Get(':articleType')
    public async getArticles(@Param('articleType', CheckArticleType) articleType: ArticleTypeEnum,
                             @Query('page', StringToNumberPipe) page: number,
                             @Query('count', StringToNumberPipe) count: number,
                             @Headers('x-language') language: LanguageEnum,
                             @Query('tagId') tagId: string): Promise<ArticleDto[]> {
        return this.articlesService.getArticlesByTypeAndFilter(articleType, language, page, count, tagId);
    }

}
