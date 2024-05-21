import {
    Module, 
} from '@nestjs/common';
import {
    AppController, 
} from './app.controller';
import {
    AppService, 
} from './app.service';
import {
    ConfigModule, 
} from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrisamModule } from './prisam/prisam.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: '.env',
        }),
        PrisamModule,
        PrismaModule,
    ],
    controllers: [AppController,],
    providers: [AppService, PrismaService,],
})
export class AppModule {}
