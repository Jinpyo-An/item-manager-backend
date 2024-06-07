import {
    PipeTransform, Injectable, BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
    transform(value: string) {
        if (value.length < 8) {
            throw new BadRequestException('비밀번호는 최소 8자 이상이어야 합니다.');
        } else if (!/[A-Z]/.test(value)) {
            throw new BadRequestException('비밀번호에는 최소 하나의 대문자가 포함되어야 합니다.');
        } else if (!/[a-z]/.test(value)) {
            throw new BadRequestException('비밀번호에는 최소 하나의 소문자가 포함되어야 합니다.');
        } else if (!/\d/.test(value)) {
            throw new BadRequestException('비밀번호에는 최소 하나의 숫자가 포함되어야 합니다.');
        } else if (!/[!@#$%^&*]/.test(value)) {
            throw new BadRequestException('비밀번호에는 최소 하나의 특수 문자가 포함되어야 합니다.');
        }

        return value;
    }
}
