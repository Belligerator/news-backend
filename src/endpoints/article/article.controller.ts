import { Body, Controller, Get, Headers, HttpCode, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LanguageEnum } from '../../models/enums/language.enum';
import { ArticleTypeEnum } from '../../models/enums/article-type.enum';
import { ArticleService } from './article.service';
import { CheckArticleType } from 'src/utils/pipes/check-article-type.pipe';
import { StringToNumberPipe } from 'src/utils/pipes/string-to-number.pipe';
import { ArticleDto } from 'src/models/dtos/article.dto';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleRequestDto } from 'src/models/dtos/article-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/services/file.service';
import { UploadedFileDto } from 'src/models/dtos/uploaded-file.dto';
import { CustomValidationPipe } from 'src/utils/pipes/validation.pipe';
import { Response } from 'express';
import * as moment from 'moment';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Administration', 'Application')
@Controller('articles')
export class ArticleController {

    constructor(private readonly articleService: ArticleService,
                private readonly fileService: FileService) {
    }

    /**
     * Export all articles to excel file.
     * 
     * @param response 
     * @returns 
     */
    @ApiOperation({ summary: 'Export all articles to excel file.' })
    // @UseGuards(AuthGuard(['jwt']))   // Commented for easier testing. In real scenario endpoint should be guarded.
    @Get('export')
    public async exportArticles(@Res() response: Response): Promise<void> {
        return this.articleService.exportArticles().then(buffer => {
            response.setHeader('Content-disposition', `attachment; filename=${moment().format('YYYY-MM-DD')}_articles.xlsx`);
            response.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            response.status(200).send(buffer);
        });
    }

    /**
     * API returns object with information get from ArticleEntity and details about article from ArticleContentEntity.
     * 
     * @param id 
     * @param language 
     * @returns article detail.
     */
    @ApiOperation({ summary: 'Get article by id.' })
    @Get('detail/:id')
    public async getArticleById(@Param('id', StringToNumberPipe) id: number,
                                @Headers('x-language') language: LanguageEnum): Promise<ArticleDto> {
        return this.articleService.getArticleById(id, language);
    }

    /**
     * Get all articles by article type.
     * API returns object with information get from ArticleEntity and details about article from ArticleContentEntity.
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
        return this.articleService.getArticlesByTypeAndFilter(articleType, language, page, count, tagId);
    }

    /**
     * API accepts ArticleRequestDto from request. For each language creates new ArticleContent.
     * 
     * @throws BadRequestException    if cannot parse tags or body is missing for some language.
     * @param body      Article request body.
     */
    @ApiOperation({ summary: 'Create new article.' })
    @ApiNotFoundResponse({ description: 'Cannot parse tags or body is missing for some language.' })
    // @UseGuards(AuthGuard(['jwt']))   // Commented for easier testing. In real scenario endpoint should be guarded.
    @HttpCode(200)
    @Post(':articleType')
    @UseInterceptors(FileInterceptor('coverImage', FileService.multerOptions))
    public async createArticle(@Param('articleType', CheckArticleType) articleType: ArticleTypeEnum,
                               @UploadedFile() file: UploadedFileDto,
                               @Body(CustomValidationPipe) body: ArticleRequestDto): Promise<void> {

        if (file) {
            await this.fileService.resizeImage(file.path);
            body.coverImage = `${file.destination}/${file.filename}`;
        }

        // Create article. If error occurs, remove file if exists.
        return this.articleService.createArticle(articleType, body).catch((error) => {
            if (file) {
                this.fileService.removeFileFromSystem(file.path);
            }
            throw error;
        });
    }

    /**
     * This API is used for updating article content by id.
     * 
     * @throws NotFoundException    if article does not exist.
     * @param articleContentId      Id of the article content.  
     * @param body                  Article details.
     * @returns                     Updated article.
     */
    @ApiOperation({ summary: 'Update article content by id.' })
    @ApiNotFoundResponse({ description: 'Article not found.' })
    // @UseGuards(AuthGuard(['jwt']))   // Commented for easier testing. In real scenario endpoint should be guarded.
    @Put(':id')
    @UseInterceptors(FileInterceptor('coverImage', FileService.multerOptions))
    public async updateArticleById(@Param('id', StringToNumberPipe) articleContentId: number,
                                   @UploadedFile() file: UploadedFileDto,
                                   @Body() body: ArticleDto): Promise<ArticleDto> {

        if (file) {
            await this.fileService.resizeImage(file.path);
            body.coverImage = `${file.destination}/${file.filename}`;
        }
        
        return this.articleService.updateArticleById(articleContentId, body).catch((error) => {
            if (file) {
                this.fileService.removeFileFromSystem(file.path);
            }
            throw error;
        });
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
    @ApiNotFoundResponse({ description: 'Article not found.' })
    // @UseGuards(AuthGuard(['jwt']))   // Commented for easier testing. In real scenario endpoint should be guarded.
    @Put(':id/activity')
    public async setArticleActivity(@Param('id', StringToNumberPipe) articleContentId: number,
                                    @Body('active') activity: boolean): Promise<void> {
        return this.articleService.setArticleActivity(articleContentId, activity);
    }
}
