import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import {
    UserProductsRepository,
} from './user-products.repository';
import {
    UserProductDto,
} from './dtos/user-product.dto';

@Injectable()
export class UserProductsService {
    constructor(private readonly userProductsRepository: UserProductsRepository) {
    }

    // createUserProduct(): 사용자 전자제품 등록
    async createUserProduct(
        userProductsDto: UserProductDto, imagePath: string, registrantId: string
    ):Promise<{userProductId: string}> {
        const {
            userProductNickname, usageStartDate, category,
        } = userProductsDto;

        // 사용자 전자제품의 종류가 무엇인지 조회
        const product = await this.userProductsRepository.getProductByCategory(category);

        if (!product) {
            throw new BadRequestException('카테고리에 해당하는 전자제품이 존재하지 않습니다.');
        }

        // 사용자 전자제품 등록
        const userProduct = await this.userProductsRepository.registerUserProduct(
            userProductNickname, imagePath, new Date(usageStartDate), registrantId, product.id
        );

        // 등록된 사용자 전자제품 아이디 반환
        return {
            userProductId: userProduct.id,
        };
    }

    // getUserProductById(): 사용자 전자제품 상세 조회
    async getUserProductById(userProductId: string) {
        // 사용자 전자제품 테이블 정보 가져오기
        const userProduct = await this.userProductsRepository.getUserProduct(userProductId);

        // 전자제품 권장 사용 기간 가져오기
        const recommendUsageDuration = await this.userProductsRepository.getProductRecommendUsageDuration(
            userProduct.product_type_id
        );

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

    // getPeriodUsed(): 등록한 전자제품을 사용한 시간 구하기
    async getPeriodUsed(usageStartDate: Date) {
        const nowDate = new Date();

        let years = nowDate.getFullYear() - usageStartDate.getFullYear();
        let months = nowDate.getMonth() - usageStartDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return {
            years,
            months,
        };
    }

    // getAvailablePeriod(): 등록한 전자제품의 사용 가능한 시간 구하기
    async getAvailablePeriod(periodUsed: { years: number, months: number }, recommendUsageDuration: number) {
        const totalPeriodUsedMonths = (periodUsed.years *12) + periodUsed.months;
        const totalRecommendUsageDurationMonths = recommendUsageDuration * 12;

        const availableMonths = totalRecommendUsageDurationMonths - totalPeriodUsedMonths;

        const years = Math.floor(availableMonths / 12);
        const months = availableMonths % 12;

        return {
            years,
            months,
        };
    }

    // getUserProducts(): 사용자 전자제품 전체 조회
    async getUserProducts(registrantId: string) {
        // 사용자 전자제품 정보 가져오기
        const userProductList1 = await this.userProductsRepository.getUserProductList(registrantId);

        const periodUsedPromises = userProductList1.map(userProduct =>
            this.getPeriodUsed(userProduct.usage_start_date)
        );

        const periodUsed = await Promise.all(periodUsedPromises);

        // userProductList에 periodUsed 객체 삽입
        const userProductList2 = userProductList1.map((userProduct, index) => {
            return {
                ...userProduct,
                periodUsed: periodUsed[index],
            };
        });

        const availablePeriodPromises = userProductList2.map(combinedProduct =>
            this.getAvailablePeriod(combinedProduct.periodUsed, combinedProduct.product_type.recommend_usage_duration));

        const availablePeriods = await Promise.all(availablePeriodPromises);

        // userProductList에 availablePeriod 객체 삽입
        const userProductList3 = userProductList2.map((userProducts2, index) => {
            return {
                ...userProducts2,
                availablePeriod: availablePeriods[index],
            };
        });

        // 응답 DTO 규격에 맞게 적용
        const userProductList = userProductList3.map(userProduct => {
            return {
                id: userProduct.id,
                userProductNickname: userProduct.user_product_nickname,
                recommendUsageDuration: userProduct.product_type.recommend_usage_duration,
                periodUsed: `${userProduct.periodUsed.years}년 ${userProduct.periodUsed.months}개월`,
                availablePeriod: `${userProduct.availablePeriod.years}년 ${userProduct.availablePeriod.months}개월`,
                imagePath: userProduct.image_path,
            };
        });

        return {
            userProductList,
        };
    }
}
