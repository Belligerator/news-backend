import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { LanguageEnum } from 'src/models/enums/language.enum';

@Index('article_id', ['articleId'], {})
@Index('IDX_fulltext', ['title', 'body'], { fulltext: true })
@Index('date_of_publication_idx', ['dateOfPublication'], {})
@Index('language', ['language'], {})
@Entity('article_content')
export class ArticleContentEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    /**
     * Id of the article to which this content belongs.
     */
    @Column({ name: 'article_id' })
    public articleId: number;

    @Column('enum', { enum: LanguageEnum })
    public language: LanguageEnum;

    @Column()
    public title: string;

    @Column('longtext')
    public body: string;

    @Column('varchar', { nullable: true, length: 255 })
    public coverImage: string | null;

    @Column('datetime', { name: 'date_of_publication' })
    public dateOfPublication: Date;

    @ManyToOne(() => ArticleEntity, (article) => article.articleContents, { cascade: true })
    @JoinColumn([{ name: 'article_id', referencedColumnName: 'id' }])
    public article: ArticleEntity;

}
