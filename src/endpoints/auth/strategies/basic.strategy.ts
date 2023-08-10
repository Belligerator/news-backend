import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

/**
 * Basic strategy for authorization. Authorization header must contain username and password.
 * 
 */
@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
    constructor() {
        super();
    }

    /**
     * Validate username and password from Authorization header.
     * @param username
     * @param password
     * @returns 
     */
    public async validate(username: string, password: string): Promise<boolean> {
        if (
            process.env.BACKEND_API_KEY &&
            process.env.BACKEND_API_SECRET &&
            username === process.env.BACKEND_API_KEY &&
            password === process.env.BACKEND_API_SECRET
        ) {
            return true;
        } else {
            return false;
        }
    }
}
