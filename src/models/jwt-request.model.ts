import { JwtPayload } from './jwt-payload.model';

export interface JwtRequest extends Request {
    jwtPayload: JwtPayload; // Payload added during jwt authentication (username/id)
}
