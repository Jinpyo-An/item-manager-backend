import {
    IsNotEmpty, IsString,
} from 'class-validator';

export class UserProductDto {
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
