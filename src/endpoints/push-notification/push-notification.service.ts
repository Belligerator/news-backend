import { Inject, Injectable, Logger } from '@nestjs/common';
import { TopicMessage } from 'firebase-admin/lib/messaging/messaging-api';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { I18nService } from 'nestjs-i18n';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { ArticleContentEntity } from 'src/entities/article-content.entity';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class PushNotificationService {


    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
                private readonly i18n: I18nService) {
    }
    
    public async sendPushNotificationToTopic(article: ArticleContentEntity, language: LanguageEnum): Promise<void> {
        const message: TopicMessage = {
            topic: 'new-article-' + language,
            notification: {
                title: this.i18n.translate('data.PUSH_NOTIFICATION_TITLE', { lang: language }),
                body: this.i18n.translate('data.PUSH_NOTIFICATION_BODY', { lang: language, args: { body: article.body } })
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

        this.logger.log('info', `[PUSH_NOTIFICATION_SERVICE] Send push notification: ${JSON.stringify(message)}`);

        // Just for testing, private key is not included in repository.
        const messageId: string = await firebaseAdmin.messaging().send(message);
        this.logger.log('info', `[PUSH_NOTIFICATION_SERVICE] Push notification sent: ${messageId}`);
    }
}
