import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { ArticleEntity } from '../article/article.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('tag')
export class TagEntity {

    @Field(type => ID)
    @PrimaryColumn()
    public id: string;

    @Field(type => ID)
    @PrimaryColumn('enum', { enum: LanguageEnum })
    public language: LanguageEnum;

    @Field()
    @Column()
    public title: string;

    @Field()
    @Column({ default: 10 })
    public order: number;

    @ManyToMany(() => ArticleEntity, item => item.tags)
    public articles?: ArticleEntity[];
}
