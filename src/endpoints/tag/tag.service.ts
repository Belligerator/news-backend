import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DEFAULT_LANGUAGE } from "src/constants";
import { TagEntity } from "src/entities/tag.entity";
import { TagDto } from "src/models/dtos/tag.dto";
import { LanguageEnum } from "src/models/enums/language.enum";
import { Repository } from "typeorm";

@Injectable()
export class TagService {

    constructor(
        @InjectRepository(TagEntity) private tagRepository: Repository<TagEntity>
    ) {
    }
    
    public async createTag(newTag: TagDto): Promise<TagDto> {

        const tag: TagEntity | null = await this.tagRepository.findOneBy({ id: newTag.id, language: newTag.language });

        if (tag) {
            throw new ConflictException("Tag already exists.");
        }

        const savedTag: TagEntity = await this.tagRepository.save({
            id: newTag.id,
            title: newTag.title,
            language: newTag.language,
            order: newTag.order
        });

        return new TagDto(savedTag);
    }

    public async getAllTags(language: LanguageEnum = DEFAULT_LANGUAGE): Promise<TagDto[]> {
        const tags: TagEntity[] = await this.tagRepository.find({ where: { language }, order: { order: 'ASC' } });

        return tags.map(tag => new TagDto(tag));
    }

    public async updateTag(newTag: TagDto): Promise<TagDto> {
        let tag: TagEntity | null = await this.tagRepository.findOne({
            where: {
                id: newTag.id,
                language: newTag.language
            }
        });

        if (!tag) {
            throw new NotFoundException("Tag not found");
        }

        tag.title = newTag.title;
        tag.order = newTag.order;

        tag = await this.tagRepository.save(tag);

        return new TagDto(tag);
    }

    public async deleteTag(newTag: TagDto): Promise<void> {
        await this.tagRepository.delete({ id: newTag.id, language: newTag.language });
    }

}