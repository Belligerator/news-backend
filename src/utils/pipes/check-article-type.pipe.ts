import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ArticleTypeEnum } from 'src/models/enums/article-type.enum';

export class CheckArticleType implements PipeTransform {
    public transform(value: ArticleTypeEnum, metadata: ArgumentMetadata): ArticleTypeEnum {
        let type: ArticleTypeEnum;
        if (value === ArticleTypeEnum.NEWS) {
            type = ArticleTypeEnum.NEWS;
        } else if (value === ArticleTypeEnum.STORY) {
            type = ArticleTypeEnum.STORY;
        } else {
            throw new BadRequestException('Wrong article type: ' + value);
        }

        return type;
    }
}
