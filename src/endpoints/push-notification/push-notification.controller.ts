import { Body, Controller, Delete, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PushTokenDto } from 'src/endpoints/push-notification/dto/push-token.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiBasicAuth()
@ApiTags('Application')
@UseGuards(AuthGuard(['basic']))
@Controller('push-notifications')
export class PushNotificationController {

    constructor(private readonly pushNotificationService: PushNotificationService) {
    }

    /**
     * Save token for push notifications.
     * @param token     Token to save.
     */
    @ApiOperation({ summary: 'Save token for push notifications.' })
    @HttpCode(200)
    @Post('token')
    public async saveToken(@Body() token: PushTokenDto): Promise<void> {
        return this.pushNotificationService.saveToken(token);
    }

    /**
     * Delete token for push notifications.
     * @param token     Token to delete.
     */
    @ApiOperation({ summary: 'Delete token for push notifications.' })
    @Delete('token')
    public async deleteToken(@Body() token: PushTokenDto): Promise<void> {
        return this.pushNotificationService.deleteToken(token);
    }
}
