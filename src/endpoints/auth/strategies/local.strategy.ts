import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly authService: AuthService) {
        super();
    }

    /**
     * Validate user from request.
     * If password is incorrect, throw UnauthorizedException.
     * Validator takes from request JSON default parameters `username` and `password`.
     * So you can't send in JSON parameters `email` and `password`. Otherwise you will get response 401.
     * Or you can set validator how parameters will be named.
     * 
     * @throws {BadRequestException} If username or password is missing.
     * @throws {UnauthorizedException} If username or password is incorrect.
     * @param username  Username.
     * @param password  Password.
     * @returns         True if user is valid, otherwise false.
     */
    public async validate(username: string, password: string): Promise<boolean> {

        if (!username || !password) {
            throw new BadRequestException('Email or password is missing.');
        }

        const success: boolean = await this.authService.validateUser(username, password);
        if (!success) {
            throw new UnauthorizedException('Email or password is incorrect.');
        }
        
        return true;
    }
}
