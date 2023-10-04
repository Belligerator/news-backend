import { Module } from "@nestjs/common";
import { PushNotificationModule } from "src/endpoints/push-notification/push-notification.module";
import { CronJobService } from "./cron-job.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PushTokenEntity } from "src/endpoints/push-notification/push-token.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PushTokenEntity]),
        PushNotificationModule
    ],
    providers: [
        CronJobService
    ],
}) export class CronJobModule { }
