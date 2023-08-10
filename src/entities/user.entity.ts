import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public username: string;

    @Column({ select: false })
    public password?: string;

    @Column({ default: false })
    public active: boolean;
    
    /**
     * Refresh token. User can be logged in from one device in one time.
     * For be able to log in from another device, table with refresh tokens must be created.
     */
    @Column('varchar', { length: 32, nullable: true, name: 'refresh_token' })
    public refreshToken: string | null;

    /**
     * Refresh token expiration date.
     */
    @Column('timestamp', { nullable: true, name: 'expiration_date' })
    public expirationDate: Date | null;

}