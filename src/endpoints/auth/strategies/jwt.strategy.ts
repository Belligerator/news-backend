import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { JwtPayload } from 'src/models/jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(@InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    /**
     * Validate user from JWT token.
     * If user is not found, throw UnauthorizedException.
     * If user is not active, throw ForbiddenException.
     */
    public async validate(payload: JwtPayload): Promise<JwtPayload> {
        const user: UserEntity | null = await this.userEntityRepository.findOne(
            {
                where: { id: payload.sub },
                select: ['active', 'id']
            });

        if (!user) {
            throw new UnauthorizedException('This endpoint can access only administrators.');
        }

        if (!user.active) {
            throw new ForbiddenException(`User is not active.`);
        }

        return payload;
    }
}
