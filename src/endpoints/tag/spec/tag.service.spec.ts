import { TagDto } from 'src/endpoints/tag/dto/tag.dto';
import { TagService } from '../tag.service';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TagEntity } from 'src/endpoints/tag/tag.entity';
import { DeleteResult, Repository } from 'typeorm';
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
const testEnDbTagDto: TagDto = {
    id: 'world',
    title: 'World',
    language: LanguageEnum.EN,
    order: 1,
};

// Tag that is already in the database. Entity.
const testEnDbTagEntity: TagEntity = {
    id: 'world',
    title: 'World',
    language: LanguageEnum.EN,
    order: 1,
};

// Tag that is already in the database. Entity.
const testCsDbTagEntity: TagEntity = {
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
    let tagRepositoryToken: string | Function = getRepositoryToken(TagEntity);

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
                    provide: tagRepositoryToken,
                    useClass: Repository,
                },
            ],
        }).compile();

        tagService = app.get<TagService>(TagService);
        tagRepository = app.get<Repository<TagEntity>>(tagRepositoryToken);
    });

    it('should be defined', () => {
        expect(tagService).toBeDefined();
    });

    describe('createTag', () => {
        it('should successfully create a tag', async () => {

            const createdEntity: TagEntity = {
                id: testNewTagDto.id,
                title: testNewTagDto.title,
                language: testNewTagDto.language,
                order: testNewTagDto.order,
            };

            jest.spyOn(tagRepository, 'save').mockResolvedValueOnce(createdEntity);
            jest.spyOn(tagRepository, 'findOneBy').mockResolvedValueOnce(null);

            const createdTag: TagDto = await tagService.createTag(testNewTagDto);

            expect(createdTag).toEqual(testNewTagDto);

            expect(tagRepository.findOneBy).toHaveBeenCalledWith({
                id: testNewTagDto.id,
                language: testNewTagDto.language,
            });

            expect(tagRepository.save).toHaveBeenCalledTimes(1);
            expect(tagRepository.save).toHaveBeenCalledWith(createdEntity);

        });
        
        it('should throw an error because of duplicity', () => {

            jest.spyOn(tagRepository, 'findOneBy').mockResolvedValueOnce(dbTags[0]);

            const duplicityTag: TagDto = {
                id: dbTags[0].id,
                title: dbTags[0].title,
                language: dbTags[0].language,
                order: dbTags[0].order,
            };

            const createdTag: Promise<TagDto> = tagService.createTag(duplicityTag);

            expect(createdTag).rejects.toThrowError(ConflictException);

            expect(tagRepository.findOneBy).toBeCalledWith({ id: duplicityTag.id, language: duplicityTag.language});
        });
    });

    describe('getAllTags', () => {
        it('should successfully get all tags', async () => {
          
            // Return only english tags.
            jest.spyOn(tagRepository, 'find').mockResolvedValueOnce([testEnDbTagEntity]);
          
            const tags: TagDto[] = await tagService.getAllTags(LanguageEnum.EN);
           
            expect(tags).toEqual([new TagDto(testEnDbTagEntity)]);

            // Check if tags are ordered.
            expect(tagRepository.find).toHaveBeenCalledWith({
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
        it('should successfully update the tag', async () => {
            
            jest.spyOn(tagRepository, 'findOne').mockResolvedValueOnce(testEnDbTagEntity);
            jest.spyOn(tagRepository, 'save').mockResolvedValueOnce(testEnDbTagEntity);
         
            const updatedTag: TagDto = await tagService.updateTag(testEnDbTagDto);

            expect(updatedTag).toEqual(testEnDbTagDto);
            expect(updatedTag).toEqual(new TagDto(testEnDbTagEntity));

            expect(tagRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: testEnDbTagDto.id,
                    language: testEnDbTagDto.language,
                }
            });
           expect(tagRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should throw an error because entity is not in the DB', () => {

            jest.spyOn(tagRepository, 'findOne').mockResolvedValueOnce(null);

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

            jest.spyOn(tagRepository, 'delete').mockResolvedValue({raw: ''} as DeleteResult);

            // This tag is not in the database. However, delete function does not check if entity exist in the database.
            // And our service does not care about it. It returns status 200. Result is the same, tag is not present in the database.
            tagService.deleteTag(testNewTagDto);

            // This tag is in the database, so it will be deleted.
            tagService.deleteTag(testEnDbTagEntity);

            expect(tagRepository.delete).toBeCalledTimes(2);
        });
    });
});
