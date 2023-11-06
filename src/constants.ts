import { LanguageEnum } from './models/enums/language.enum';

export const PAGE_COUNT: number = 50;
export const DEFAULT_LANGUAGE: LanguageEnum = LanguageEnum.EN;
export const MAX_FILE_SIZE: number = 1024 * 1024 * 15; // 15 MB
export const DIRECTORY_IMAGES: string = 'uploads/images';
export const REFRESH_TOKEN_SIZE: number = 32;
export const SERVER_URL: string = process.env.SERVER_URL ?? '';
