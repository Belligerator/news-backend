import { Body, Controller, Delete, Get, Headers, HttpCode, Post, Put } from "@nestjs/common";
import { TagService } from "./tag.service";
import { TagDto } from "src/models/dtos/tag.dto";
import { ApiConflictResponse, ApiNotFoundResponse, ApiOperation } from "@nestjs/swagger";
import { LanguageEnum } from "src/models/enums/language.enum";
import { CustomValidationPipe } from "src/utils/pipes/validation.pipe";

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
     * @returns         Tag.
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
     * @param id        Tag id.
     * @param newTag    New tag.
     * @returns         Updated tag.
     */
    @ApiOperation({ summary: 'Get tag.' })
    @ApiNotFoundResponse({ description: 'Tag not found.' })
    @Put()
    public async updateTag(@Body(CustomValidationPipe) newTag: TagDto): Promise<TagDto> {
        return this.tagService.updateTag(newTag);
    }

    /**
     * Delete tag.
     * 
     * @param newTag    Tag to delete. 
     */
    @ApiOperation({ summary: 'Delete tag.' })
    @Delete()
    public async deleteTag(@Body() newTag: TagDto): Promise<void> {
        return this.tagService.deleteTag(newTag);
    }
}
