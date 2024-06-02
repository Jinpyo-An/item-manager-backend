import {
    Body,
    Controller, Headers, Post,
} from '@nestjs/common';
import {
    AuthService, 
} from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('token/access')
    postAccessToken(@Headers('Authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const newToken = this.authService.rotateToken(token, false);
        
        return {
            accessToken: newToken,
        };
    }

    @Post('token/refresh')
    postRefreshToken(@Headers('Authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const newToken = this.authService.rotateToken(token, true);

        return {
            refreshToken: newToken,
        };
    }

    /**
     * 요청 해더: Basic email:password
     * email:password는 base64로 인코딩된 상태로 요청을 보냄
     */
    @Post('signin')
    signinEmail(@Headers('Authorization') rawToken: string) {
        const token = this.authService.extractTokenFromHeader(rawToken, false);

        const emailAndPassword = this.authService.decodeBasicToken(token);

        return this.authService.signInWithEmail(emailAndPassword);
    }

    @Post('signup')
    signupEmail(@Body('name') name: string,
                @Body('email') email: string,
                @Body('password') password: string,) {
        return this.authService.signUpWithEmail({
            name,
            email,
            password,
        });
    }
}
