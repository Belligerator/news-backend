import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { ArticleEntity } from './article.entity';

@Entity('tag')
export class TagEntity {

    @PrimaryColumn()
    public id: string;

    @PrimaryColumn('enum', { enum: LanguageEnum })
    public language: LanguageEnum;

    @Column()
    public title: string;

    @Column({ default: 10 })
    public order: number;

    @ManyToMany(() => ArticleEntity, item => item.tags)
    public articles?: ArticleEntity[];
}
