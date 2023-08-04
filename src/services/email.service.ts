import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { ArticleDto } from "src/models/dtos/article.dto";
import { SentryService } from "./sentry.service";
import * as path from 'path';
import * as moment from "moment";

@Injectable()
export class EmailService {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
                private readonly sentryService: SentryService,
                private readonly mailerService: MailerService) {
    }

    /**
     * Send email about new article.
     * @param article   Article to send.
     */
    public async sendEmail(article: ArticleDto): Promise<void> {
        this.logger.log('info', `[EMAIL_SERVICE] Sending email about new article ${article.articleContentId}`);

        this.mailerService.sendMail({
            to: 'test@test.com',
            subject: 'New article: ' + article.title,
            template: 'new-article',
            context: {
                title: article.title,
                body: article.body,
                coverImage: article.coverImage,
                dateOfPublication: moment(article.dateOfPublication).format('DD.MM.YYYY'),
            },
            attachments: [{
                filename: 'best-news.png',
                path: path.join(__dirname, '..', 'templates', 'assets', 'images', 'best-news.png'),
                contentType: 'image/png',
                cid: 'newsSmall',
            }]
        }).then(() => {
            this.logger.log('info', `Email about new article ${article.articleContentId} was sent.`);
        }).catch((error) => {
            this.sentryService.captureException('[EMAIL_SERVICE_ERROR] Cannot send email.', `Email about new article (${article.articleContentId}-${article.title}) was not sent. Error: ${error}`);
        });
    }
}