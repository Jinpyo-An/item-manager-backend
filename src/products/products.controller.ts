import {
    Controller, Get, Param, ParseUUIDPipe, UseGuards,
} from '@nestjs/common';
import {
    ProductsService, 
} from './products.service';
import {
    AccessTokenGuard, 
} from '../auth/guard/bearer-token.guard';

@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @UseGuards(AccessTokenGuard)
    getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    getProductById(@Param('id', ParseUUIDPipe) productId: string) {
        return this.productsService.getProductById(productId);
    }
}
