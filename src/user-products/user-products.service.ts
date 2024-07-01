import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import {
    UserProductsRepository,
} from './user-products.repository';
import {
    UserProductsDto, 
} from './dtos/user-products.dto';

@Injectable()
export class UserProductsService {
    constructor(private readonly userProductsRepository: UserProductsRepository) {
    }

    /**
     * createUserProduct(): 사용자 전자제품 등록
     *
     * @param userProductsDto   => 제품등록에 필요한 데이터
     * @param imageUrl          => 이미지가 저장되어 있는 경로
     * @param registrantId      => 전자제품을 등록하는 사용자 아이디
     */
    async createUserProduct(userProductsDto: UserProductsDto, imageUrl: string, registrantId: string):Promise<{userProductId: string}> {
        // DTO를 각각의 변수에 저장
        const {
            nickname, usageStartDate, category,
        } = userProductsDto;

        // 사용자 전자제품의 종류가 무엇인지 조회
        const product = await this.userProductsRepository.getProductByCategory(category);

        if (!product) {
            throw new BadRequestException('카테고리에 해당하는 전자제품이 존재하지 않습니다.');
        }

        // 사용자 전자제품 등록
        const userProduct = await this.userProductsRepository.registerUserProduct(nickname, imageUrl, new Date(usageStartDate), registrantId, product.id);

        // 등록된 사용자 전자제품 아이디 반환
        return {
            userProductId: userProduct.id,
        };
    }
}
