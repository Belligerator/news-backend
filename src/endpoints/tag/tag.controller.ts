import { Body, Controller, Delete, Get, Headers, HttpCode, Post, Put, UseInterceptors } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagDto } from 'src/endpoints/tag/dto/tag.dto';
import { ApiConflictResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { CustomValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheKeyEnum } from 'src/models/enums/cache-key.enum';

@ApiTags('Administration', 'Application')
@UseInterceptors(CacheInterceptor)
@CacheKey(CacheKeyEnum.TAGS)
@Controller('tags')
export class TagController {

    constructor(private readonly tagService: TagService) { }

    /**
     * Create new tag if not exists.
     * 
     * @throws          ConflictException if tag already exists.
     * @param newTag    New tag.
     * @returns         Created tag.
     */
    @ApiOperation({ summary: 'Create new tag if not exists.' })
    @ApiConflictResponse({ description: 'Tag already exists.' })
    @HttpCode(200)
    @Post()
    public async createTag(@Body(CustomValidationPipe) newTag: TagDto): Promise<TagDto> {
        return this.tagService.createTag(newTag);
    }

    /**
     * Get tag by id for specific language.
     * @returns         List of tags.
     */
    @ApiOperation({ summary: 'Get all tags.' })
    @Get()
    public async getAllTags(@Headers('x-language') language: LanguageEnum): Promise<TagDto[]> {
        return this.tagService.getAllTags(language);
    }

    /**
     * Update tag.
     * 
     * @throws          NotFoundException if tag not found.
     * @param tag       New tag.
     * @returns         Updated tag.
     */
    @ApiOperation({ summary: 'Get tag.' })
    @ApiNotFoundResponse({ description: 'Tag not found.' })
    @Put()
    public async updateTag(@Body(CustomValidationPipe) tag: TagDto): Promise<TagDto> {
        return this.tagService.updateTag(tag);
    }

    /**
     * Delete tag.
     * 
     * @param tag       Tag to delete.
     */
    @ApiOperation({ summary: 'Delete tag.' })
    @Delete()
    public async deleteTag(@Body() tag: TagDto): Promise<void> {
        return this.tagService.deleteTag(tag);
    }
}
