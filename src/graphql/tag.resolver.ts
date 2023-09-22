import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TagEntity } from "src/entities/tag.entity";
import { TagGQLService } from "./tag.service";
import { TagDto } from "src/models/dtos/tag.dto";

@Resolver((of: TagEntity) => TagEntity)
export class TagResolver {

    constructor(private readonly tagService: TagGQLService) { }

    @Query(returns => [TagEntity])
    public async getTags(): Promise<TagEntity[]> {
            return await this.tagService.getAllTags();
    }

    @Mutation(returns => TagEntity)
    async createTag(@Args('tag') tagDto: TagDto): Promise<TagEntity> {
        return await this.tagService.createTag(tagDto)
    }
}