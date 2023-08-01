import { LanguageEnum } from "src/models/enums/language.enum";

export class TagDto {

    /**
     * Uniqe string shortcut for tag.
     * @example world for World news.
     */
    public id: string;

    /**
     * What language is the tag available in?
     * @example en
     */
    public language: LanguageEnum;

    /**
     * User-friendly name of the tag.
     * @example World
     */
    public title: string;

}
