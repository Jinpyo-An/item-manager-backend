import {
    Body,
    Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors,
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
    UserProductDto,
} from './dtos/user-product.dto';
import {
    USER_PRODUCTS_PUBLIC_IMAGE_PATH,
} from '../const/path.const';

@Controller('item-manager/api/user-products')
export class UserProductsController {
    constructor(private readonly userProductsService: UserProductsService) {}

    // 사용자 전자제품 등록
    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('image'))
    createUserProduct(@Request() request: any,
                      @Body() userProductDto: UserProductDto,
                      @UploadedFile() file: Express.Multer.File): Promise<{userProductId: string}> {
        // 전자제품 등록한 사람 아이디 저장
        const registrantId = request.user.id;

        // 파일 경로 저장
        const imagePath = `${USER_PRODUCTS_PUBLIC_IMAGE_PATH}/${file.filename}`;

        // 등록된 사용자 전자제품 아이디 반환
        return this.userProductsService.createUserProduct(userProductDto, imagePath, registrantId);
    }

    // 사용자 전자제품 조회
    @Get()
    @UseGuards(AccessTokenGuard)
    async getUserProducts(@Request() request: any) {
        const registrantId = request.user.id;

        return await this.userProductsService.getUserProducts(registrantId);
    }

    // 사용자 전자제품 상세 조회
    @Get(':userProductId')
    @UseGuards(AccessTokenGuard)
    async getUserProductById(@Param('userProductId', ParseUUIDPipe) userProductId: string) {
        return await this.userProductsService.getUserProductById(userProductId);
    }

    // 사용자 전자제품 수정
    @Patch(':userProductId')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FileInterceptor('image'))
    modifyUserProductById(@Param('userProductId', ParseUUIDPipe) userProductId: string,
                          @Body('userProductNickname') userProductNickname?: string,
                          @Body('usageStartDate') usageStartDate?: string,
                          @UploadedFile() file?: Express.Multer.File) {

        // 파일 경로 저장
        if (file !== undefined) {
            const imagePath = `${USER_PRODUCTS_PUBLIC_IMAGE_PATH}/${file.filename}`;

            return this.userProductsService.modifyUserProductById(
                userProductId, userProductNickname, usageStartDate, imagePath
            );
        }

        return this.userProductsService.modifyUserProductById(
            userProductId, userProductNickname, usageStartDate
        );
    }

    // 사용자 전자제품 삭제
    @Delete(':userProductId')
    @UseGuards(AccessTokenGuard)
    deleteUserProductById(@Param('userProductId', ParseUUIDPipe) userProductId: string) {
        return this.userProductsService.deleteUserProductById(userProductId);
    }
}
