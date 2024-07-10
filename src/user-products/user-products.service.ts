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

    async createUserProduct(userProductsDto: UserProductsDto, imagePath: string, registrantId: string):Promise<{userProductId: string}> {
        // DTO를 각각의 변수에 저장
        const {
            userProductNickname, usageStartDate, category,
        } = userProductsDto;

        // 사용자 전자제품의 종류가 무엇인지 조회
        const product = await this.userProductsRepository.getProductByCategory(category);

        if (!product) {
            throw new BadRequestException('카테고리에 해당하는 전자제품이 존재하지 않습니다.');
        }

        // 사용자 전자제품 등록
        const userProduct = await this.userProductsRepository.registerUserProduct(userProductNickname, imagePath, new Date(usageStartDate), registrantId, product.id);

        // 등록된 사용자 전자제품 아이디 반환
        return {
            userProductId: userProduct.id,
        };
    }

    async getUserProductById(userProductId: string) {
        // 사용자 전자제품 테이블 정보 가져오기
        const userProduct = await this.userProductsRepository.getUserProduct(userProductId);

        // 전자제품 권장 사용 기간 가져오기
        const recommendUsageDuration = await this.userProductsRepository.getProductRecommendUsageDuration(userProduct.product_type_id);

        // 전자제품을 지금까지 사용한 시간 구하기
        const periodUsed = await this.getPeriodUsed(userProduct.usage_start_date);

        // 사용 가능한 시간 구하기
        const availablePeriod = await this.getAvailablePeriod(periodUsed, recommendUsageDuration);

        return {
            id: userProduct.id,
            userProductNickname: userProduct.user_product_nickname,
            recommendUsageDuration: recommendUsageDuration,
            periodUsed: `${periodUsed.years}년 ${periodUsed.months}개월`,
            availablePeriod: `${availablePeriod.years}년 ${availablePeriod.months}개월`,
            imagePath: userProduct.image_path,
        };
    }

    async getPeriodUsed(usageStartDate: Date) {
        const now = new Date();

        let years = now.getFullYear() - usageStartDate.getFullYear();
        let months = now.getMonth() - usageStartDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return {
            years,
            months,
        };
    }

    async getAvailablePeriod(periodUsed: { years: number, months: number }, recommendUsageDuration: number) {
        const totalUsedMonths = (periodUsed.years *12) + periodUsed.months;
        const totalRecommendMonths = recommendUsageDuration * 12;

        const remainMonths = totalRecommendMonths - totalUsedMonths;

        const years = Math.floor(remainMonths / 12);
        const months = remainMonths % 12;

        return {
            years,
            months,
        };
    }

    /**
     * 사용자 전자제품 조회 시나리오
     * 1. 등록자 아이디로 등록한 전자제품들을 가져온다.
     * 2. 배열의 각각의 객체 요소에 계산에 필요한 recommendUsageDuration를 추가한다.
     */
    async getUserProducts(registrantId: string) {
        const userProducts = await this.userProductsRepository.getUserProducts(registrantId);
    }
}
