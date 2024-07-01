import {
    join, 
} from 'node:path';
import * as process from 'node:process';

// 프로젝트 루트 폴더
export const PROJECT_ROOT_PATH = process.cwd();

// public 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';

// 사용자 전자제품 이미지들을 저장할 폴더 이름
export const USER_PRODUCTS_FOLDER_NAME = 'user-products';

// public 폴더의 절대 경로
// /{프로젝트 위치}/public
export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME
);

// 사용자 전자제품을 저장할 폴더의 절대 경로
// {프로젝트 위치}/public/user-products
export const USER_PRODUCTS_IMAGE_PATH = join(
    PUBLIC_FOLDER_PATH, USER_PRODUCTS_FOLDER_NAME
);

// 사용자 전자제품을 저장할 폴더의 상대 경로
// /public/user-products/xxx.jpg
export const USER_PRODUCTS_PUBLIC_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME, USER_PRODUCTS_FOLDER_NAME
);
