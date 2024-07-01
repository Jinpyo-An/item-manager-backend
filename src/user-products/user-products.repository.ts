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
        return this.prismaService.product.findUnique({
            where: {
                category,
            },
        });
    }

    registerUserProduct(nickname: string, imageUrl: string, usageStartDate: Date, registrantId: string, productId: string) {
        return this.prismaService.user_product.create({
            data: {
                nickname,
                image_url: imageUrl,
                usage_start_date: usageStartDate,
                registrant_id: registrantId,
                product_id: productId,
            },
        });
    }
}
