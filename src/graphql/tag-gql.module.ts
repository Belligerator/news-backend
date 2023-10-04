import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { TagGQLService } from "./tag.service";
import { TagResolver } from "./tag.resolver";
import { TagEntity } from "src/endpoints/tag/tag.entity";

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
    providers: [TagGQLService, TagResolver],
}) export class TagGQLModule { }
