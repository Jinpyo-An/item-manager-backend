import {
    Injectable,
} from '@nestjs/common';
import {
    UsersRepository,
} from './users.repository';
import {
    Prisma, 
} from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) {
    }

    createUser(userDto: Pick<Prisma.userCreateInput, 'name' | 'email' | 'password'>) {
        return this.userRepository.createUser(userDto);
    }

    getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    async getUserByEmail(userEmail: string) {
        return await this.userRepository.getUserByEmail(userEmail);
    }
}
