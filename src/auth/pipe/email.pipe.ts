import {
    PipeTransform, Injectable, BadRequestException,
} from '@nestjs/common';

@Injectable()
export class EmailPipe implements PipeTransform {
    transform(value: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(value)) {
            throw new BadRequestException('유효하지 않은 이메일 주소입니다.');
        }

        return value;
    }
}
