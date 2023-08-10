import { DEFAULT_LANGUAGE } from 'src/constants';
import { LanguageEnum } from 'src/models/enums/language.enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Entity for storing push tokens.
 * Mobile application does not have user accounts, so sending push notifications to a specific user does not make sense.
 * It is only for purpose of sample application. We will send push notication (daily cookie :D) to a random device (token).
 */
@Entity('push_token')
export class PushTokenEntity {

    @PrimaryColumn()
    public token: string;

    @Column('enum', { enum: LanguageEnum, default: DEFAULT_LANGUAGE })
    public language: LanguageEnum;
    
    @Column('datetime', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    /**
     * Last time when token saved to database.
     * onUpdate will not update time, because there are no columns to update. So we need to update it manually.
     * This column is used for finding when application was last time opened. It is not guaranteed because token can be changed on device.
     */
    @Column('datetime', { name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    public updatedAt: Date;

}
