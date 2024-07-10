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

    async getProductByCategory(category: string) {
        return this.prismaService.products.findUnique({
            where: {
                category,
            },
        });
    }

    async registerUserProduct(userProductNickname: string, imageUrl: string, usageStartDate: Date, registrantId: string, productTypeId: string) {
        return this.prismaService.user_products.create({
            data: {
                user_product_nickname: userProductNickname,
                image_path: imageUrl,
                usage_start_date: usageStartDate,
                registrant_id: registrantId,
                product_type_id: productTypeId,
            },
        });
    }
    
    async getUserProduct(userProductId: string) {
        const userProduct = await this.prismaService.user_products.findUnique({
            where: {
                id: userProductId,
            },
        });

        if (!userProduct) {
            throw new BadRequestException('등록하신 전자제품이 존재하지 않습니다.');
        }

        return userProduct;
    }

    async getProductRecommendUsageDuration(productId: string) {
        const recommendUsageDuration = await this.prismaService.products.findUnique({
            where: {
                id: productId,
            },
            select: {
                recommend_usage_duration: true,
            },
        });

        if (!recommendUsageDuration) {
            throw new BadRequestException("해당 전자제품의 권장사용기간은 존재하지 않습니다.");
        }

        return  recommendUsageDuration.recommend_usage_duration;
    }

    getUserProducts(registrantId: string) {
        return this.prismaService.user_products.findMany({
            where: {
                registrant_id: registrantId,
            },
        });
    }
}
