import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_LANGUAGE } from 'src/constants';
import { TagEntity } from 'src/entities/tag.entity';
import { TagDto } from 'src/models/dtos/tag.dto';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { Repository } from 'typeorm';

@Injectable()
export class TagGQLService {

    constructor(
        @InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>
    ) {
    }

    /**
     * Create new tag if not exists.
     * 
     * @throws          ConflictException if tag already exists.
     * @param newTag    New tag. 
     * @returns         Created tag.
     */
    public async createTag(newTag: TagDto): Promise<TagEntity> {

        const tag: TagEntity | null = await this.tagRepository.findOneBy({ id: newTag.id, language: newTag.language });

        if (tag) {
            throw new ConflictException('Tag already exists.');
        }

        const savedTag: TagEntity = await this.tagRepository.save({
            id: newTag.id,
            title: newTag.title,
            language: newTag.language,
            order: newTag.order
        });

        return savedTag;
    }

    /**
     * Get tag by id for specific language.
     * 
     * @returns         List of tags.
     */
    public async getAllTags(language: LanguageEnum = DEFAULT_LANGUAGE): Promise<TagEntity[]> {
        return await this.tagRepository.find({ where: { language }, order: { order: 'ASC' } });
    }

    /**
     * Update tag.
     * 
     * @throws          NotFoundException if tag not found.
     * @param tag       New tag.
     * @returns         Updated tag.
     */
    public async updateTag(newTag: TagDto): Promise<TagDto> {
        let tag: TagEntity | null = await this.tagRepository.findOne({
            where: {
                id: newTag.id,
                language: newTag.language
            }
        });

        if (!tag) {
            throw new NotFoundException('Tag not found');
        }

        tag.title = newTag.title;
        tag.order = newTag.order;

        tag = await this.tagRepository.save(tag);

        return new TagDto(tag);
    }

    /**
     * Delete tag.
     * 
     * @param tag       Tag to delete. 
     */
    public async deleteTag(newTag: TagDto): Promise<void> {
        await this.tagRepository.delete({ id: newTag.id, language: newTag.language });
    }

}