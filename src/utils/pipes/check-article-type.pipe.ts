import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ArticleTypeEnum } from 'src/models/enums/article-type.enum';

/**
 * Pipe for checking article type. If type is not valid, BadRequestException is thrown.
 */
export class CheckArticleTypePipe implements PipeTransform {
    public transform(value: ArticleTypeEnum): ArticleTypeEnum {

        for (const articleType of Object.values(ArticleTypeEnum)) {
            if (value === articleType) {
                return articleType;
            }
        }
        
        throw new BadRequestException(`Unsupported article type: ${value}`);
    }
}
