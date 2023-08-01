import { ArticleContentEntity } from "src/entities/article-content.entity";
import { TagDto } from "./tag.dto";

export class ArticleDto {

    public articleContentId: number;

    public title: string;
    
    public body: string;

    /**
     * Content (title, body) language.
     * @example 'cs'
     */
    public language: string;
    
    public articleType: string;
    
    /**
     * Id of the parent article.
     */
    public parent: number | null;

    /**
     * Date when the article was publicated or updated.
     */
    public dateOfPublication: Date;

    /**
     * What tags are associated with this article. Useful for filtering.
     */
    public tags: TagDto[];

    constructor(articleContent: ArticleContentEntity) {
        this.articleContentId = articleContent.id;
        this.articleType = articleContent.article.articleType;
        this.language = articleContent.language;
        this.title = articleContent.title;
        this.body = articleContent.body;
        this.parent = articleContent.article.parent;
        this.tags = articleContent.article.tags;
        this.dateOfPublication = articleContent.dateOfPublication;
    }
}
