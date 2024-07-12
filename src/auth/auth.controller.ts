import {
    Body,
    Controller, Headers, Post, UseGuards, Request,
} from '@nestjs/common';
import {
    AuthService, 
} from './auth.service';
import {
    PasswordPipe, 
} from './pipe/password.pipe';
import {
    EmailPipe, 
} from './pipe/email.pipe';
import {
    NamePipe, 
} from './pipe/name.pipe';
import {
    BasicTokenGuard, 
} from './guard/basic-token.guard';
import {
    RefreshTokenGuard,
} from './guard/bearer-token.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('token/access')
    @UseGuards(RefreshTokenGuard)
    createAccessToken(@Request() request: any): { accessToken: string } {
        const newToken = this.authService.rotateToken(request.token, false);
        
        return {
            accessToken: newToken,
        };
    }

    @Post('token/refresh')
    @UseGuards(RefreshTokenGuard)
    createRefreshToken(@Request() request: any): { refreshToken: string } {
        const newToken = this.authService.rotateToken(request.token, true);

        return {
            refreshToken: newToken,
        };
    }

    /**
     * 요청 해더: Basic email:password
     * email:password는 base64로 인코딩된 상태로 요청을 보냄
     */
    @Post('signin')
    @UseGuards(BasicTokenGuard)
    signinEmail(@Headers('authorization') rawToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const emailAndPassword = this.authService.decodeBasicToken(token);

        return this.authService.signInWithEmail(emailAndPassword);
    }

    @Post('signup')
    signupEmail(@Body('name', NamePipe) name: string,
                @Body('email', EmailPipe) email: string,
                @Body('password', PasswordPipe) password: string,
    ): Promise<{ accessToken: string, refreshToken: string }> {
        return this.authService.signUpWithEmail({
            name,
            email,
            password,
        });
    }
}
