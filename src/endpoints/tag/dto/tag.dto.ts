import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { TagEntity } from 'src/endpoints/tag/tag.entity';
import { LanguageEnum } from 'src/models/enums/language.enum';

@InputType()
export class TagDto {

    /**
     * Unique string shortcut for tag.
     * @example world for World news.
     */
    @IsNotEmpty()
    @Field()
    public id: string;

    /**
     * What language is the tag available in?
     * @example en
     */
    @IsNotEmpty()
    @Field()
    public language: LanguageEnum;

    /**
     * User-friendly name of the tag.
     * @example World
     */
    @IsNotEmpty()
    @Field()
    public title: string;

    /**
     * Order of the tag.
     */
    @Field({ nullable: true })
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
