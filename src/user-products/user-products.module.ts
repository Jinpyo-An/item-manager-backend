import {
    BadRequestException,
    Module,
} from '@nestjs/common';
import {
    UserProductsService,
} from './user-products.service';
import {
    UserProductsController,
} from './user-products.controller';
import {
    PrismaModule,
} from '../prisma/prisma.module';
import {
    AuthModule,
} from '../auth/auth.module';
import {
    JwtModule,
} from '@nestjs/jwt';
import {
    UsersModule,
} from '../users/users.module';
import {
    ProductsModule,
} from '../products/products.module';
import {
    UserProductsRepository,
} from './user-products.repository';
import {
    MulterModule,
} from '@nestjs/platform-express';
import {
    extname,
} from 'node:path';
import * as multer from 'multer';
import {
    USER_PRODUCTS_IMAGE_PATH, 
} from '../const/path.const';
import {
    v4 as uuid,
} from 'uuid';

@Module({
    imports: [PrismaModule,
        AuthModule,
        UsersModule,
        ProductsModule,
        JwtModule.register({}),
        MulterModule.register({
            fileFilter: (req, file, callback) => {
                const ext = extname(file.originalname);

                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return callback(
                        new BadRequestException('jpg, jpeg, png 파일만 업로드 가능합니다.'), false
                    );
                }

                return callback(null, true);
            },
            storage: multer.diskStorage({
                destination: function(req, file, callback) {
                    callback(null, USER_PRODUCTS_IMAGE_PATH);
                },
                filename(req, file, callback) {
                    callback(null, `${uuid()}${extname(file.originalname)}`);
                },
            }),
        }),],
    controllers: [UserProductsController,],
    providers: [UserProductsService,
        UserProductsRepository,],
})
export class UserProductsModule {
}
