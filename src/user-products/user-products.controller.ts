import {
    Body,
    Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import {
    UserProductsService, 
} from './user-products.service';
import {
    AccessTokenGuard, 
} from '../auth/guard/bearer-token.guard';
import {
    FileInterceptor, 
} from '@nestjs/platform-express';
import {
    UserProductsDto, 
} from './dtos/user-products.dto';
import {
    USER_PRODUCTS_PUBLIC_IMAGE_PATH,
} from '../const/path.const';

@Controller('api/user-products')
export class UserProductsController {
    constructor(private readonly userProductsService: UserProductsService) {}

    // 사용자 전자제품 등록
    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('image'))
    createUserProduct(@Request() request: any,
                      @Body() userProductsDto: UserProductsDto,
                      @UploadedFile() file: Express.Multer.File): Promise<{userProductId: string}> {
        // 제품 등록자(사용자) 아이디 저장
        const registrantId = request.user.id;

        // 파일 경로 저장
        const imagePath = `${USER_PRODUCTS_PUBLIC_IMAGE_PATH}/${file.filename}`;

        return this.userProductsService.createUserProduct(userProductsDto, imagePath, registrantId);
    }

    // 사용자 전자제품 조회
    @Get()
    @UseGuards(AccessTokenGuard)
    getUserProducts() {}

    // 사용자 전자제품 상세 조회
    @Get(':userProductId')
    @UseGuards(AccessTokenGuard)
    getUserProductById(@Param('userProductId') userProductId: string) {
        return
    }

    // 사용자 전자제품 수정
    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    patchUserProductById() {}

    // 사용자 전자제품 삭제
    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    deleteUserProductById() {}
}
