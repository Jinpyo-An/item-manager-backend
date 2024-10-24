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

    async createUser(user: Pick<Prisma.usersCreateInput, 'name' | 'email' | 'password'>) {
        const emailExists = await this.prismaService.users.findFirst({
            where: {
                email: user.email,
            },
        });

        if (emailExists) {
            throw new  BadRequestException('이미 가입한 이메일입니다.');
        }

        return this.prismaService.users.create({
            data: user,
        });
    };

    getAllUsers() {
        return this.prismaService.users.findMany();
    };

    async getUserByEmail(userEmail: string) {
        return this.prismaService.users.findFirst({
            where: {
                email: userEmail,
            },
        });
    }
}
