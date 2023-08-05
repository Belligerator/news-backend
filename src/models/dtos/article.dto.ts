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
     * Is article active?
     */
    public active: boolean;

    /**
     * Cover image of the article.
     */
    public coverImage: string | null;

    /**
     * Date when the article was publicated or updated.
     */
    public dateOfPublication: Date;

    /**
     * What tags are associated with this article. Useful for filtering.
     */
    public tags: TagDto[];

    /**
     * Tags in string format. When coming from form.
     */
    public updatedTags: string;

    constructor(articleContent: ArticleContentEntity, short: boolean = false) {
        this.articleContentId = articleContent.id;
        this.title = articleContent.title;
        this.dateOfPublication = articleContent.dateOfPublication;

        if (!short) {
            this.articleType = articleContent.article.articleType;
            this.language = articleContent.language;
            this.body = articleContent.body;
            this.active = articleContent.article.active;
            this.parent = articleContent.article.parent;
            this.coverImage = articleContent.coverImage;
            this.tags = articleContent.article.tags?.filter(tag => tag.language == articleContent.language) ?? [];
        }
    }
}
