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
     * @param imagePath          => 이미지가 저장되어 있는 경로
     * @param registrantId      => 전자제품을 등록하는 사용자 아이디
     */
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

    /**
     * 사용자 전자제품 상세 조회 API 설계
     * 1. 사용자 전자제품 정보를 가져온다.
     * 2. 사용자 전자제품의 권장 사용 기간을 가져온다.
     * 3. 현재 날짜와 사용 시작 날짜를 통해 사용한 시간를 계산한다.
     * 4. 사용한 시간과 권장 시간을 통해 사용 가능한 시간을 계산한다.
     */
    async getUserProductById(userProductId: string) {
        const userProduct = await this.userProductsRepository.getUserProduct(userProductId);

        const recommendUsageDuration = await this.userProductsRepository.getProductRecommendUsageDuration(userProduct.product_type_id);

        const periodUsed = await this.getPeriodUsed(userProduct.usage_start_date);

        const availablePeriod =
    }

    // 사용자 전자제품 사용한 시간 계산
    async getPeriodUsed(usageStartDate: Date): Promise<string> {
        const currentDate = new Date();

        // 년 차이 계산
        let yearDifference = currentDate.getFullYear() - usageStartDate.getFullYear();

        // 월 차이 계산
        let monthDifference = currentDate.getMonth() - usageStartDate.getMonth();

        // 일 차이 계산
        let dayDifference = currentDate.getDay() - usageStartDate.getDay();

        if (dayDifference < 0) {
            monthDifference--;
        }

        if (monthDifference < 0) {
            yearDifference--;
            monthDifference +=12;
        }

        if (dayDifference < 0) {
            const previousMonth = (currentDate.getMonth() - 1 + 12) % 12;
            const daysInPreviousMonth = new Date(currentDate.getFullYear(), previousMonth + 1, 0).getDate();
            dayDifference += daysInPreviousMonth;
        }

        return `${yearDifference}년 ${monthDifference} 개월`;
    }
}
