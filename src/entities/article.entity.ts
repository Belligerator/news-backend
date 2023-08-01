import { ArticleTypeEnum } from "src/models/enums/article-type.enum";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleContentEntity } from "./article-content.entity";
import { TagEntity } from "./tag.entity";

@Entity('article')
export class ArticleEntity {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('enum', { name: 'article_type', enum: ArticleTypeEnum })
    public articleType: ArticleTypeEnum;

    @Column({ default: false })
    public active: boolean;

    @Column({ nullable: true })
    public parent: number | null;

    /**
     * Article creation timestamp.
     */
    @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
    public timestamp: Date;

    @OneToMany(() => ArticleContentEntity, (articleContent) => articleContent.article)
    public articleContents?: ArticleContentEntity[];

    @ManyToOne(() => ArticleEntity, (article) => article.childrenArticles, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'parent', referencedColumnName: 'id' }])
    public parentArticle?: ArticleEntity;

    @OneToMany(() => ArticleEntity, (article) => article.parentArticle)
    public childrenArticles?: ArticleEntity[];
    
    @ManyToMany(() => TagEntity, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    })
    @JoinTable({
        name: 'article__tag',
        joinColumns: [
            { name: 'article_id', referencedColumnName: 'id'},
        ],
        inverseJoinColumns: [
            { name: 'tag_id', referencedColumnName: 'id'},
            { name: 'tag_language', referencedColumnName: 'language'},
        ]
    })
    public tags: TagEntity[];
}