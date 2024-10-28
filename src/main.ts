import {
    NestFactory, 
} from '@nestjs/core';
import {
    AppModule, 
} from './app.module';
import {
    Logger,
    ValidationPipe,
} from '@nestjs/common';
import {
    ConfigService, 
} from '@nestjs/config';
import {
    NestExpressApplication,
} from "@nestjs/platform-express";
import * as path from "node:path";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useStaticAssets(path.join(__dirname, '../public/user-products',));

    const configService = app.get(ConfigService);
    const PORT = configService.get('APP_PORT');
    const HOST = configService.get('APP_HOST');
    await app.listen(PORT);
    Logger.log(`Application running on port: ${PORT}, http://${HOST}:${PORT}`);
}
bootstrap();
