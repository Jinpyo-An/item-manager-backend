import {
    PipeTransform, Injectable, BadRequestException,
} from '@nestjs/common';

Injectable();
export class NamePipe implements PipeTransform {
    transform(value: string) {
        if(value.length > 20) {
            throw new BadRequestException('이름은 최대 20 글자 이하여야 합니다.');
        }

        return value;
    }

}
