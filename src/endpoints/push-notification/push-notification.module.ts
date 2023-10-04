import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { PushTokenEntity } from "./push-token.entity";
import { PushNotificationController } from "./push-notification.controller";
import { PushNotificationService } from "./push-notification.service";

@Module({
    imports: [TypeOrmModule.forFeature([PushTokenEntity])],
    controllers: [PushNotificationController],
    providers: [PushNotificationService],
    exports: [PushNotificationService],
}) export class PushNotificationModule { }
