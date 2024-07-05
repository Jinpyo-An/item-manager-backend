import {
    IsNotEmpty, IsString,
} from 'class-validator';

export class UserProductsDto {
  @IsString()
  @IsNotEmpty()
  userProductNickname: string;

  @IsString()
  @IsNotEmpty()
  usageStartDate: Date;

  @IsString()
  @IsNotEmpty()
  category: string;
}
