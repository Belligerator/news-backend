import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PushNotificationService } from 'src/endpoints/push-notification/push-notification.service';

@Injectable()
export class CronJobService {
    constructor(private pushNotificationService: PushNotificationService) {}

    /**
     * Cron job for sending free daily cookie via push notifications.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    public async checkAndSendPushNotificationsCronJob(): Promise<void> {
        this.pushNotificationService.sendCookieToRandomDevice();
    }
}
