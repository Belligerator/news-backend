import { TagController } from '../tag.controller';
import { TagService } from '../tag.service';

import { LanguageEnum } from 'src/models/enums/language.enum';
import { TagDto } from 'src/endpoints/tag/dto/tag.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { DEFAULT_LANGUAGE } from 'src/constants';

const testTagDto: TagDto = {
    id: 'world',
    title: 'World',
    language: LanguageEnum.EN,
    order: 1,
};

describe('TagController', () => {
    let tagController: TagController;
    let tagService: TagService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [TagController],
            providers: [
                { provide: CACHE_MANAGER, useValue: {} },
                {
                    provide: TagService,
                    useValue: {
                        createTag: jest
                            .fn()
                            .mockImplementation((tag: TagDto) =>
                                Promise.resolve(tag),
                            ),
                        getAllTags: jest
                            .fn()
                            .mockResolvedValue([testTagDto]),
                        updateTag: jest
                            .fn()
                            .mockImplementation((tag: TagDto) =>
                                Promise.resolve(tag),
                            ),
                        deleteTag: jest.fn(),
                    },
                },
            ],
        }).compile();

        tagController = app.get<TagController>(TagController);
        tagService = app.get<TagService>(TagService);
    });

    it('should be defined', () => {
        expect(tagController).toBeDefined();
    });

    describe('createTag', () => {
        it('should create a tag', () => {

            const createdTag: Promise<TagDto> = tagController.createTag(testTagDto);

            expect(createdTag).resolves.toEqual(testTagDto);

            expect(tagService.createTag).toHaveBeenCalledWith(testTagDto);

        });
    });

    describe('getAllTags', () => {
        it('should return all tags with specific language', () => {

            // Info. Controller does not care about language, it is handled by service.
            const tags: Promise<TagDto[]> = tagController.getAllTags(LanguageEnum.EN);

            expect(tags).resolves.toEqual([testTagDto]);

            expect(tagService.getAllTags).toHaveBeenCalledWith(LanguageEnum.EN);

        });
    });

    describe('updateTag', () => {
        it('should update the tag', () => {

            const updatedTag: Promise<TagDto> = tagController.updateTag(testTagDto);

            expect(updatedTag).resolves.toEqual(testTagDto);

            expect(tagService.updateTag).toHaveBeenCalledWith(testTagDto);

        });
    });

    describe('deleteTag', () => {
        it('should delete the tag', () => {

            tagController.deleteTag(testTagDto);

            expect(tagService.deleteTag).toHaveBeenCalledWith(testTagDto);
            
        });
    });
});
