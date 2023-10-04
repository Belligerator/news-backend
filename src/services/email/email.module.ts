import { Module } from "@nestjs/common";
import { PushNotificationModule } from "src/endpoints/push-notification/push-notification.module";
import { SentryModule } from "../sentry/sentry.module";
import { EmailService } from "./email.service";

@Module({
    imports: [PushNotificationModule, SentryModule],
    providers: [EmailService],
    exports: [EmailService],
}) export class EmailModule { }
