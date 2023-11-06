import { Module } from "@nestjs/common";
import { SentryModule } from "../sentry/sentry.module";
import { EmailService } from "./email.service";

@Module({
    imports: [SentryModule],
    providers: [EmailService],
    exports: [EmailService],
}) export class EmailModule { }
