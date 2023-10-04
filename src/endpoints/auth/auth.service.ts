import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/endpoints/auth/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/models/jwt-payload.model';
import { REFRESH_TOKEN_SIZE } from 'src/constants';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as randomToken from 'rand-token';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) {
    }

    /**
     * Sign up user.
     * 
     * @param username  User username. Must be unique.
     * @param password  User password.
     * @returns         Access token and refresh token.
     */
    public async signUpUser(username: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {

        if (!username || !password) {
            throw new BadRequestException('Email or password is missing.');
        }

        const user: UserEntity | null = await this.userEntityRepository.findOne({
            where: { username: username }
        });

        if (user) {
            throw new ConflictException(`User '${username}' already exists.`);
        } else {
            await this.userEntityRepository.insert({
                username: username,
                password: await this.cryptNewPassword(password),
                // Just for testing. In real app, user should be inactive and after username verification, user should be activated.
                active: true,
            });
        }

        return this.signInUser(username);
    }

    /**
     * Sign in user.
     * 
     * @param username  User username.
     * @returns         Access token and refresh token.
     */
    public async signInUser(username: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user: UserEntity = await this.getActiveUser(username);

        const refreshToken: string = this.setAndReturnNewRefreshToken(user);

        await this.userEntityRepository.save(user);

        const payload: JwtPayload = {
            sub: user.id,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: refreshToken,
        };
    }

    /**
     * Sign out user. Delete refresh token and expiration date.
     * 
     * @param jwtPayload    JWT payload with user ID.
     */
    public async signOutUser(jwtPayload: JwtPayload): Promise<void> {
        const userId: number = jwtPayload.sub;
        if (userId === undefined) {
            throw new NotFoundException('Cannot find user.');
        }

        const userEntity: UserEntity | null = await this.userEntityRepository.findOneBy({ id: userId });

        if (userEntity) {
            userEntity.refreshToken = null;
            userEntity.expirationDate = null;
            await this.userEntityRepository.save(userEntity);
        }
    }

    /**
     * Refresh access token with refresh token. If refresh token is invalid, throw UnauthorizedException.
     * 
     * @param userId        User ID.
     * @param refreshToken  Refresh token.
     * @returns             New access token and new refresh token.
     */
    public async refreshAccessToken(userId: number, refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        const user: UserEntity | null = await this.userEntityRepository.findOne({
            where: { id: userId, refreshToken: refreshToken }
        });

        const now: Date = moment().toDate();

        if (!user || !user.expirationDate || now > user.expirationDate) {
            throw new UnauthorizedException('Invalid refresh token, please sign in.');
        }

        const newRefreshToken: string = this.setAndReturnNewRefreshToken(user);
        
        await this.userEntityRepository.save(user);

        const payload: JwtPayload = {
            sub: user.id,
        };

        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
            refreshToken: newRefreshToken
        };
    }

    /**
     * Validate user with username and password.
     * 
     * @param username          User username.
     * @param validatedPassword User password. 
     * @returns                 True if user is valid, otherwise false.
     */
    public async validateUser(username: string, validatedPassword: string): Promise<boolean> {
        const user: UserEntity | null = await this.userEntityRepository.findOne({
            where: { username: username },
            select: ['password', 'id']
        });

        if (!user || !user.password) {
            return false;
        }

        if (await this.passwordsAreEqual(validatedPassword, user.password)) {
            return true;
        }
        return false;
    }

    /**
     * Get user by username or id. If user is not active, throw ForbiddenException.
     * 
     * @param username  User username.
     * @param userId    User ID.
     * @returns         User entity.
     */
    private async getActiveUser(username: string): Promise<UserEntity> {

        const user: UserEntity | null = await this.userEntityRepository.findOne({
            where: { username: username }
        });

        if (!user) {
            throw new NotFoundException(`User cannot be found.`);
        }

        if (!user.active) {
            throw new ForbiddenException(`User is not active.`);
        }

        return user;
    }

    /**
     * Set new refresh token ro user object and return it.
     * 
     * @param user  User entity to update.
     * @returns     New refresh token.
     */
    private setAndReturnNewRefreshToken(user: UserEntity): string {
        user.refreshToken = this.generateRefreshToken();
        user.expirationDate = moment().add(30, 'd').toDate();
        return user.refreshToken;
    }

    /**
     * Generate random refresh token.
     * 
     * @returns     Refresh token.
     */
    private generateRefreshToken(): string {
        return randomToken.generate(REFRESH_TOKEN_SIZE);
    }

    /**
     * Crypt new password with bcrypt.
     * 
     * @param newPassword   New user password.
     * @returns             Crypted password.
     */
    private async cryptNewPassword(newPassword: string): Promise<string> {
        return await bcrypt.hash(newPassword, await bcrypt.genSalt());
    }

    /**
     * Compare plain password with hashed password.
     * 
     * @param plainPassword     Plain password.
     * @param hashedPassword    Hashed password.
     * @returns                 True if passwords are equal, otherwise false.
     */
    private async passwordsAreEqual(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}
