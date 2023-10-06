import { BadRequestException } from '@nestjs/common';
import { CheckArticleTypePipe } from './check-article-type.pipe';
import { ArticleTypeEnum } from 'src/models/enums/article-type.enum';

describe('CheckArticleTypePipe', () => {
    let pipe: CheckArticleTypePipe;

    beforeEach(() => {
        pipe = new CheckArticleTypePipe();
    });

    it('should be defined', () => {
        expect(new CheckArticleTypePipe()).toBeDefined();
    });

    it('should throw error - wrong article type', () => {
        const value: () => ArticleTypeEnum = () => pipe.transform((ArticleTypeEnum.NEWS + '-bad') as ArticleTypeEnum);
        expect(value).toThrowError(BadRequestException);
    });

    it('should succeed and return article type enum', () => {
        // Loop through all article types and check if pipe returns same value.
        for (const articleType of Object.values(ArticleTypeEnum)) {
            expect(pipe.transform(articleType)).toBe(articleType);
        }
    });

});
