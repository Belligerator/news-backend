import { IsNotEmpty } from 'class-validator';

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
     * URL of the cover image on the server.
     */
    public coverImage: string;

    /**
     * Stringified array of tag ids.
     */
    @IsNotEmpty()
    public tags: string;

    /**
     * Date when the article is publicated. If not present, current date is used.
     */
    public dateOfPublication: Date;
}
