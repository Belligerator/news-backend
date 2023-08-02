import { IsNotEmpty } from 'class-validator';
import { TagDto } from './tag.dto';

/**
 * DTO for validating article from the reqeust during article creation.
 */
export class ArticleRequestDto {

    @IsNotEmpty()
    public title: { cs: string, en: string };
    
    @IsNotEmpty()
    public body: { cs: string, en: string };

    /**
     * Id of the parent article.
     */
    public parent: number;

    /**
     * Stringified array of tag ids.
     */
    @IsNotEmpty()
    public tags: TagDto[];

    /**
     * Date when the article is publicated. If not present, current date is used.
     */
    public dateOfPublication: Date;
}
