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
import {
    UserProductsModule, 
} from './user-products/user-products.module';
import {
    ServeStaticModule, 
} from '@nestjs/serve-static';
import {
    PUBLIC_FOLDER_PATH, 
} from './const/path.const';
import { AppController } from './app.controller';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: '.env',
        }),
        ServeStaticModule.forRoot({
            rootPath: PUBLIC_FOLDER_PATH,
            serveRoot: '/public',
        }),
        PrismaModule,
        UsersModule,
        AuthModule,
        ProductsModule,
        UserProductsModule,
    ],
    controllers: [AppController],
    providers: [PrismaService,],
})
export class AppModule {}
