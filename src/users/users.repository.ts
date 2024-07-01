import {
    PrismaService, 
} from '../prisma/prisma.service';
import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import {
    Prisma, 
} from '@prisma/client';

@Injectable()
export class UsersRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    async createUser(user: Pick<Prisma.userCreateInput, 'name' | 'email' | 'password'>) {
        const emailExists = await this.prismaService.user.findFirst({
            where: {
                email: user.email,
            },
        });

        if (emailExists) {
            throw new  BadRequestException('이미 가입한 이메일입니다.');
        }

        return this.prismaService.user.create({
            data: user,
        });
    };

    getAllUsers() {
        return this.prismaService.user.findMany();
    };

    async getUserByEmail(userEmail: string) {
        return this.prismaService.user.findFirst({
            where: {
                email: userEmail,
            },
        });
    }
}
