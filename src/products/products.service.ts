import {
    Injectable, 
} from '@nestjs/common';
import {
    ProductsRepository, 
} from './products.repository';

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductsRepository) {
    }

    getAllProducts() {
        return this.productsRepository.getAllProducts();
    }

    getProductById(productId: string) {
        return this.productsRepository.getProductById(productId);
    }
}
