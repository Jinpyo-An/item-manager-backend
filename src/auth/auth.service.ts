import {
    Injectable, UnauthorizedException,
} from '@nestjs/common';
import {
    Prisma, 
} from '@prisma/client';
import {
    JwtService, 
} from '@nestjs/jwt';
import {
    HASH_ROUNDS, JWT_SECRET, 
} from './const/auth.const';
import * as bcrypt from 'bcrypt';
import {
    UsersService, 
} from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
                private readonly jwtService: JwtService) {}

    /**
     * 로그인할 때, Basic 토큰과 함께 요청
     * {authorization: 'Basic {token}'}
     *
     * 아무나 접근할 수 없는 정보를 접근할 때: accessToken을 Header에 추가해 요청
     * {authorization: 'Bearer {token}'}
     *
     * 요청 받은 토큰을 검증을 통해 어떤 사용자인지 판별
     */

    extractTokenFromHeader(header: string, isBearer: boolean) {
        const splitToken = header.split(' ');

        const prefix = isBearer ? 'Bearer' : 'Basic';

        if (splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new UnauthorizedException('잘못된 토큰입니다.');
        }
        
        const token = splitToken[1];

        return token;
    }

    /**
     * base64로 인코딩된 email:password를 디코딩 후 리스트로 반환
     * email과 password를 객체로 반환
     */
    decodeBasicToken(basicToken: string) {
        const decoded = Buffer.from(basicToken, 'base64').toString('utf8');

        const split = decoded.split(':');

        if (split.length !== 2) {
            throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
        }

        const email = split[0];
        const password = split[1];

        return {
            email,
            password,
        };
    }

    /**
     * verifyToken()
     * 토큰 검증
     */
    verifyToken(token: string) {
        try {
            return this.jwtService.verify(token, {
                secret: JWT_SECRET,
            });
        } catch (err) {
            throw new UnauthorizedException('토큰이 만료되었거나 잘못된 토큰입니다.');
        }
    }

    /**
     * rotateToken()
     * 토큰 새로 발급
     * refreshToken을 받아 해당 토큰을 검증 후, accessToken 보낸다.
     */
    rotateToken(token: string, isRefreshToken: boolean) {
        const decoded = this.jwtService.verify(token, {
            secret: JWT_SECRET,
        });

        if (decoded.type !== 'refresh') {
            throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다.');
        }

        return this.signToken(
            {
                ...decoded,
            }, isRefreshToken);
    }

    /**
     * signToken()
     * accessToken과 refreshToken을 sign(생성)
     * 회원가입과 로그인(signUpWithEmail, signInWithEmail) 시 사용
     */
    signToken(user: Pick<Prisma.userCreateInput, 'email' | 'id'>, isRefreshToken: boolean) {
        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access',
        };

        return this.jwtService.sign(payload, {
            secret: JWT_SECRET,
            expiresIn: isRefreshToken ? 3600: 300,
        });
    }

    /**
     * signInUser
     * 사용자 확인 완료 -> accessToken과 refreshToken을 반환
     */
    returnToken(user: Pick<Prisma.userCreateInput, 'email' | 'id'>) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        };
    }

    /**
     * name, email, password를 입력받고 사용자 생성
     * 사용자 생성 시, accessToken, RefreshToken 반환
     */
    async signUpWithEmail(user: Pick<Prisma.userCreateInput, 'name' | 'email' | 'password'>) {
        const hashPassword = await bcrypt.hash(user.password, HASH_ROUNDS);

        const newUser = await this.userService.createUser({
            ...user,
            password: hashPassword,
        });

        return this.returnToken(newUser);
    }

    /**
     * loginWithEmail()
     * 가입한 사용자가 email, password를 입력하면 검증을 진행
     * 검증이 완료되면, accessToken과 refreshToken을 반환
     */
    async signInWithEmail(user: Pick<Prisma.userCreateInput, 'email' | 'password'>) {
        const existingUser = await this.authenticateWithEmailAndPassword(user);

        return this.returnToken(existingUser);
    }

    /**
     * 로그인(signInWithEmail)을 진행할 때, 필요한 검증 진행
     * 1. 사용자 존재 확인(email)
     * 2. 비밀번호 맞는 지 확인
     * 3. 모두 통과 시, 사용자 정보 반환
     */
    async authenticateWithEmailAndPassword(user: Pick<Prisma.userCreateInput, 'email' | 'password'>) {
        const existingUser = await this.userService.getUserByEmail(user.email);

        if (!existingUser) {
            throw new UnauthorizedException('존재하지 않은 사용자입니다.');
        }

        const passOk = await bcrypt.compare(user.password, existingUser.password);

        if (!passOk) {
            throw new UnauthorizedException('비밀번호가 틀렸습니다.');
        }

        return existingUser;
    }
}
