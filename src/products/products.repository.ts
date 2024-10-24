import {
    Injectable, 
} from '@nestjs/common';
import {
    PrismaService, 
} from '../prisma/prisma.service';

@Injectable()
export class ProductsRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    getAllProducts() {
        return this.prismaService.products.findMany();
    }

    getProductById(productId: string) {
        return this.prismaService.products.findFirst({
            where: {
                id: productId,
            },
        });
    }
}
