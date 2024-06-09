import {
    Module, 
} from '@nestjs/common';
import {
    ConfigModule, 
} from '@nestjs/config';
import {
    PrismaService, 
} from './prisma/prisma.service';
import {
    PrismaModule,
} from './prisma/prisma.module';
import {
    UsersModule, 
} from './users/users.module';
import {
    AuthModule,
} from './auth/auth.module';
import {
    ProductsModule, 
} from './products/products.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: '.env',
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        ProductsModule,
    ],
    controllers: [],
    providers: [PrismaService,],
})
export class AppModule {}
