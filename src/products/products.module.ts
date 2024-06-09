import {
    Module, 
} from '@nestjs/common';
import {
    ProductsService, 
} from './products.service';
import {
    ProductsController, 
} from './products.controller';
import {
    PrismaModule, 
} from '../prisma/prisma.module';
import {
    ProductsRepository, 
} from './products.repository';
import {
    AuthModule, 
} from '../auth/auth.module';
import {
    UsersModule, 
} from '../users/users.module';
import {
    JwtModule, 
} from '@nestjs/jwt';

@Module({
    imports: [PrismaModule,
        AuthModule,
        UsersModule,
        JwtModule.register({}),],
    controllers: [ProductsController,],
    providers: [ProductsService,
        ProductsRepository,],
})
export class ProductsModule {}
