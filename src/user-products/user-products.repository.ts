import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import {
    PrismaService, 
} from '../prisma/prisma.service';

@Injectable()
export class UserProductsRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    getProductByCategory(category: string) {
        return this.prismaService.products.findUnique({
            where: {
                category,
            },
        });
    }

    registerUserProduct(nickname: string, imageUrl: string, usageStartDate: Date, registrantId: string, productId: string) {
        return this.prismaService.user_products.create({
            data: {
                user_product_nickname: nickname,
                image_path: imageUrl,
                usage_start_date: usageStartDate,
                registrant_id: registrantId,
                product_type_id: productId,
            },
        });
    }
}
