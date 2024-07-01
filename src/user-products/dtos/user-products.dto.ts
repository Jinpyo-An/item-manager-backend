import {
    IsNotEmpty, IsString,
} from 'class-validator';

export class UserProductsDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  usageStartDate: Date;

  @IsString()
  @IsNotEmpty()
  category: string;
}
