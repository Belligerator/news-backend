import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RequiredParameterPipe } from 'src/shared/pipes/required-parameter.pipe';
import { JwtRequest } from 'src/models/jwt-request.model';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Administration')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Sign up new user.
     * 
     * @throws BadRequestException  If username or password is not provided.
     * @throws ConflictException    If username is not unique.
     * @param username              Username.
     * @param password              Password.
     * @returns                     Access token and refresh token.
     */
    @ApiOperation({ summary: 'Sign up new user. Used for admin panel.' })
    @ApiBadRequestResponse({ description: 'Username or password is not provided.' })
    @ApiConflictResponse({ description: 'Username is not unique.' })
    @HttpCode(200)
    @Post('sign-up')
    public signUpUser(
        @Body('username', RequiredParameterPipe) username: string,
        @Body('password', RequiredParameterPipe) password: string,
    ): Promise<{ accessToken: string; refreshToken: string; }> {
        return this.authService.signUpUser(username, password);
    }

    /**
     * Sign in user.
     * 
     * @throws UnauthorizedException    If username or password is not correct.
     * @throws ForbiddenException       If user is not active.
     * @param username                  Username.
     * @param password                  Password.
     * @returns                         Access token and refresh token.
     */
    @ApiOperation({ summary: 'Sign in user.' })
    @ApiUnauthorizedResponse({ description: 'Username or password is not correct.' })
    @ApiForbiddenResponse({ description: 'User is not active.' })
    @UseGuards(AuthGuard('local'))
    @HttpCode(200)
    @Post('sign-in')
    public signInUser(
        @Body('username', RequiredParameterPipe) username: string,
        // Password is not used here, because it is already checked in AuthGuard('local') - local.strategy.ts.
        // However, it is required for swagger.
        @Body('password', RequiredParameterPipe) password: string,
    ): Promise<{ accessToken: string; refreshToken: string; }> {
        return this.authService.signInUser(username);
    }

    /**
     * Sign out user. Delete refresh token from user.
     * 
     * @throws UnauthorizedException If JWT payload is not valid.
     * @throws NotFoundException If jwtPayload.userId is not provided.
     * @param request   Request with JWT payload.
     * @returns
     */
    @ApiOperation({ summary: 'Sign out user. Delete refresh token from user.' })
    @ApiUnauthorizedResponse({ description: 'JWT payload is not valid.' })
    @ApiNotFoundResponse({ description: 'jwtPayload.userId is not provided.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard(['jwt']))
    @Get('sign-out')
    public signOutUser(@Req() request: JwtRequest): Promise<void> {
        return this.authService.signOutUser(request.jwtPayload);
    }

    /**
     * Refresh access token with refresh token.
     * 
     * @throws UnauthorizedException If refresh token is invalid, old.
     * @param refreshToken  Refresh token used for refresh access token.
     * @param userId        User ID, whose refresh token must be updated.
     * @returns             New access token and new refresh token.
     */
    @ApiOperation({ summary: 'Refresh access token with refresh token.' })
    @ApiUnauthorizedResponse({ description: 'Invalid refresh token, please sign in.' })
    @HttpCode(200)
    @Post('refresh-token')
    public refreshAccessToken(
        @Body('refreshToken', RequiredParameterPipe) refreshToken: string,
        @Body('userId', RequiredParameterPipe) userId: number,
    ): Promise<{ accessToken: string; refreshToken: string; }> {
        return this.authService.refreshAccessToken(userId, refreshToken);
    }
}
