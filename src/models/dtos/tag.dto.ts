import { IsNotEmpty } from "class-validator";
import { TagEntity } from "src/entities/tag.entity";
import { LanguageEnum } from "src/models/enums/language.enum";

export class TagDto {

    /**
     * Uniqe string shortcut for tag.
     * @example world for World news.
     */
    @IsNotEmpty()
    public id: string;

    /**
     * What language is the tag available in?
     * @example en
     */
    @IsNotEmpty()
    public language: LanguageEnum;

    /**
     * User-friendly name of the tag.
     * @example World
     */
    @IsNotEmpty()
    public title: string;

    /**
     * Order of the tag.
     */
    public order: number;

    constructor(tagEntity: TagEntity) {
        if (tagEntity) {
            this.id = tagEntity.id;
            this.language = tagEntity.language;
            this.title = tagEntity.title;
            this.order = tagEntity.order;
        }
    }
    
}
