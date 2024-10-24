import {
    Module, 
} from '@nestjs/common';
import {
    UsersService, 
} from './users.service';
import {
    UsersController, 
} from './users.controller';
import {
    PrismaModule, 
} from '../prisma/prisma.module';
import {
    UsersRepository,
} from './users.repository';

@Module({
    imports: [PrismaModule,],
    exports: [UsersService,],
    controllers: [UsersController,],
    providers: [UsersService,
        UsersRepository,
    ],
})
export class UsersModule {}
