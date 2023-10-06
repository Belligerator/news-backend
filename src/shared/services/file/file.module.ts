import { Module } from "@nestjs/common";
import { SentryModule } from "../sentry/sentry.module";
import { FileService } from "./file.service";

@Module({
    imports: [SentryModule],
    providers: [FileService],
    exports: [FileService],
}) export class FileModule { }
