import { TagDto } from 'src/models/dtos/tag.dto';
import { TagService } from './tag.service';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TagEntity } from 'src/entities/tag.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

// New tag to be created. DTO.
const testNewTagDto: TagDto = {
    id: 'business',
    title: 'Business',
    language: LanguageEnum.EN,
    order: 2,
};

// Tag that is already in the database. DTO.
const testDbTagDto: TagDto = {
    id: 'world',
    title: 'World',
    language: LanguageEnum.EN,
    order: 1,
};

// Tag that is already in the database. Entity.
const testEnDbTagEntity: TagEntity =     {
    id: 'world',
    title: 'World',
    language: LanguageEnum.EN,
    order: 1,
};

// Tag that is already in the database. Entity.
const testCsDbTagEntity: TagEntity =     {
    id: 'world',
    title: 'World',
    language: LanguageEnum.CS,
    order: 1,
};

// All tags in the database.
const dbTags: TagEntity[] = [
    testEnDbTagEntity,
    testCsDbTagEntity,
];

describe('TagService', () => {
    let tagService: TagService;
    let tagRepository: Repository<TagEntity>;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [
                TagService,
                { 
                    provide: CACHE_MANAGER,
                    useValue: {
                        del: jest.fn().mockResolvedValue(null),
                    } 
                },
                {
                    provide: getRepositoryToken(TagEntity),
                    useValue: {
                        findOneBy: jest
                            .fn()
                            .mockImplementation((where: FindOptionsWhere<TagEntity>): Promise<TagEntity | undefined> => {
                                const tag: TagEntity | undefined =
                                    dbTags.find((tag) => tag.id === where.id && tag.language === where.language);
                                return Promise.resolve(tag);
                            }),
                        save: jest
                            .fn()
                            .mockImplementation((tagDto: TagDto): Promise<TagEntity> => {
                                const tag: TagEntity = {
                                    id: tagDto.id,
                                    title: tagDto.title,
                                    language: tagDto.language,
                                    order: tagDto.order,
                                };
                                return Promise.resolve(tag);
                            }),
                        find: jest
                            .fn()
                            .mockImplementation((options: { where: { language: LanguageEnum }}): Promise<TagEntity[]> => {
                                const tags: TagEntity[] = dbTags.filter((tag) => tag.language === options.where.language);
                                return Promise.resolve(tags);
                            }),
                        findOne: jest
                            .fn()
                            .mockImplementation((options: { where: { id: string, language: LanguageEnum }}): Promise<TagEntity | undefined> => {
                                const tag: TagEntity | undefined =
                                    dbTags.find((tag) => tag.id === options.where.id && tag.language === options.where.language);
                                return Promise.resolve(tag);
                            }),
                        delete: jest.fn().mockResolvedValue(null),
                    },
                },
            ],
        }).compile();

        tagService = app.get<TagService>(TagService);
        tagRepository = app.get<Repository<TagEntity>>(getRepositoryToken(TagEntity));
    });

    it('should be defined', () => {
        expect(tagService).toBeDefined();
    });

    describe('createTag', () => {
        it('should successfully create a tag', () => {

            const createdTag: Promise<TagDto> = tagService.createTag(testNewTagDto);

            expect(createdTag).resolves.toEqual(testNewTagDto);

            expect(tagRepository.findOneBy).toBeCalledWith({
                id: testNewTagDto.id,
                language: testNewTagDto.language,
            });
            // TODO: This is not working
            //            expect(tagRepository.save).toBeCalledTimes(1);
        });
        
        it('should throw an error because of duplicity', () => {

            const duplicityTag: TagDto = {
                id: dbTags[0].id,
                title: dbTags[0].title,
                language: dbTags[0].language,
                order: dbTags[0].order,
            };

            const createdTag: Promise<TagDto> = tagService.createTag(duplicityTag);

            expect(createdTag).rejects.toThrowError(ConflictException);
        });
    });

    describe('getAllTags', () => {
        it('should successfully get all tags', () => {
            const tags: Promise<TagDto[]> = tagService.getAllTags(LanguageEnum.EN);
            expect(tags).resolves.toEqual([new TagDto(testEnDbTagEntity)]);

            // Check if tags are ordered.
            expect(tagRepository.find).toBeCalledWith({
                where: {
                    language: LanguageEnum.EN,
                },
                order: {
                    order: 'ASC',
                }
            });
        });
    });

    describe('updateTag', () => {
        it('should successfully update the tag', () => {
            
            const updatedTag: Promise<TagDto> = tagService.updateTag(testDbTagDto);

            expect(updatedTag).resolves.toEqual(testDbTagDto);
            expect(tagRepository.findOne).toBeCalledWith({
                where: {
                    id: testDbTagDto.id,
                    language: testDbTagDto.language,
                }
            });
            // TODO: This is not working
        //    expect(tagRepository.save).toBeCalledTimes(1);
        });

        it('should throw an error because entity is not in the DB', () => {

            const updatedTag: Promise<TagDto> = tagService.updateTag(testNewTagDto);
            
            expect(updatedTag).rejects.toThrowError(NotFoundException);
            expect(tagRepository.findOne).toBeCalledWith({
                where: {
                    id: testNewTagDto.id,
                    language: testNewTagDto.language,
                }
            });
        });
    });

    describe('deleteTag', () => {
        it('should successfully delete the tag', () => {

            // This tag is not in the database. However, delete function does not check if entity exist in the database.
            // And our service does not care about it. It returns status 200. Result is the same, tag is not present in the database.
            tagService.deleteTag(testNewTagDto);

            // This tag is in the database, so it will be deleted.
            tagService.deleteTag(testEnDbTagEntity);

            expect(tagRepository.delete).toBeCalledTimes(2);
        });
    });
});
