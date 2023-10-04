import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagEntity } from 'src/endpoints/tag/tag.entity';
import { TagGQLService } from './tag.service';
import { TagDto } from 'src/endpoints/tag/dto/tag.dto';

@Resolver((of: TagEntity) => TagEntity)
export class TagResolver {

    constructor(private readonly tagService: TagGQLService) { }

    @Query(() => [TagEntity])
    public async getTags(): Promise<TagEntity[]> {
        return await this.tagService.getAllTags();
    }

    @Mutation(() => TagEntity)
    public async createTag(@Args('tag') tagDto: TagDto): Promise<TagEntity> {
        return await this.tagService.createTag(tagDto)
    }
}