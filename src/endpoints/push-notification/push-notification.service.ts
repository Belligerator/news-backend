import { Inject, Injectable, Logger } from '@nestjs/common';
import { TokenMessage, TopicMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { I18nService } from 'nestjs-i18n';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { ArticleContentEntity } from 'src/entities/article-content.entity';
import * as firebaseAdmin from 'firebase-admin';
import { PushTokenDto } from 'src/models/dtos/token.dto';
import { PushTokenEntity } from 'src/entities/push-token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PushNotificationService {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
                @InjectRepository(PushTokenEntity) private readonly pushTokenRepository: Repository<PushTokenEntity>,
                private readonly i18n: I18nService) {
    }
    
    /**
     * Save token for push notifications.
     * @param token     Token to save.
     */
    public async saveToken(token: PushTokenDto): Promise<void> {
        await this.pushTokenRepository.save({ token: token.token, language: token.language, updatedAt: new Date() });
    }

    /**
     * Delete token for push notifications.
     * @param token 
     */
    public async deleteToken(token: PushTokenDto): Promise<void> {
        await this.pushTokenRepository.delete({ token: token.token });
    }

    /**
     * Send push notification to topic when new article is created.
     * 
     * @param article   Article to send.
     * @param language  Language of article. Used to send notification to correct topic.
     */
    public async sendPushNotificationToTopic(article: ArticleContentEntity, language: LanguageEnum): Promise<void> {
        const message: TopicMessage = {
            topic: 'new-article-' + language,
            notification: {
                title: this.i18n.translate('data.PUSH_NOTIFICATION_TITLE', { lang: language }),
                body: this.i18n.translate('data.PUSH_NOTIFICATION_BODY', {
                    lang: language,
                    // Do not send whole article body, just first 255 characters.
                    args: { body: article.body.length > 252 ? article.body.substring(0, 252) + '...' : article.body }
                })
            },
            data: {
                articleId: article.id + '',
                articleType: article.article.articleType
            },
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    icon: 'notification_icon',
                },
            },
        };

        // Just for testing, private key is not included in repository.
        const messageId: string = await firebaseAdmin.messaging().send(message);
        this.logger.log('info', `[PUSH_NOTIFICATION_SERVICE] Push notification sent: ${messageId}`);
    }

    /**
     * Send push notification to random device. Used as example.
     * Mobile app does not have user authentication, so we cannot send push notification to specific user.
     */
    public async sendCookieToRandomDevice(): Promise<void> {
        const pushTokens: PushTokenEntity[] = await this.pushTokenRepository.find();
        
        if (pushTokens.length === 0) {
            return;
        }

        const randomToken: PushTokenEntity = pushTokens[Math.floor(Math.random() * pushTokens.length)];

        const message: TokenMessage = {
            token: randomToken.token,
            notification: {
                title: this.i18n.translate('data.PUSH_NOTIFICATION_TITLE_COOKIE', { lang: randomToken.language }),
                body: this.i18n.translate('data.PUSH_NOTIFICATION_BODY_COOKIE', { lang: randomToken.language })
            },
            android: {
                notification: {
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    icon: 'notification_icon',
                },
            },
        };

        this.logger.log('info', `[PUSH_NOTIFICATION_SERVICE] Send push notification: ${JSON.stringify(message)}`);
        firebaseAdmin.messaging().send(message)
            .catch((error) => {
                this.logger.log('error', `[PUSH_NOTIFICATION_SERVICE] Error while sending push notification: ${error}`);

                // If error occurs, remove token from database.
                this.deleteToken({ token: randomToken.token, language: randomToken.language });
            });
    }
}
