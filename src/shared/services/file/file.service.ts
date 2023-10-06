import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

import { DIRECTORY_IMAGES, MAX_FILE_SIZE } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { SentryService } from '../sentry/sentry.service';
import { SERVER_URL } from 'src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request } from 'express';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class FileService {

    constructor(private readonly sentryService: SentryService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    }

    /**
     * Options for multer.
     */
    public static multerOptions: MulterOptions = {
        storage: diskStorage({
            destination: DIRECTORY_IMAGES,
            filename: (_req, file, cb) => {
                return cb(null, FileService.getRandomName(file.originalname));
            },
        }),
        fileFilter: FileService.fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    };
    
    /**
     * Generate random name for file.
     * @param originalname  Original name of file to get extension.
     * @returns             Random name with extension.
     */
    public static getRandomName(originalname: string): string {
        const randomName: string = uuidv4();
        return `${randomName}${extname(originalname)}`;
    }

    /**
     * Filter files that have not allowed extension.
     */
    private static fileFilter(_req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void): void {
        const allowedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];

        if (!allowedFileTypes.includes(file.mimetype)) {
            return cb(new BadRequestException('Only JPG, JPEG, PNG and GIF files are allowed.'), false);
        }
        return cb(null, true);
    }

    /**
     * Resize image to 360px width. Image size is reduced.
     * @param path  Path to image.
     * @returns     True if image was resized, false otherwise.
     */
    public async resizeImage(path: string): Promise<boolean> {
        const buffer: Buffer = await sharp(path)
            .resize({
                width: 360,
                fit: 'inside',
            })
            .toBuffer();

        try {
            await sharp(buffer).toFile(path);
            return true;
        } catch (error) {
            this.sentryService.captureException('Error while resizing image.', error);
        }
        return false;
    }

    /**
     * Remove file from system.
     * @param fileUrl 
     * @returns 
     */
    public async removeFileFromSystem(fileUrl: string): Promise<boolean> {
        if (!fileUrl) {
            return true;
        }
        return new Promise((resolve) => {
            let oldDataRelativeUrl: string = '';

            // If fileUrl starts with SERVER_URL, then remove it.
            if (fileUrl.startsWith(SERVER_URL)) {
                oldDataRelativeUrl = fileUrl.replace(SERVER_URL, '');
            }

            // If fileUrl starts with '/', then remove it.
            if (oldDataRelativeUrl.startsWith('/')) {
                oldDataRelativeUrl = oldDataRelativeUrl.replace('/', '');
            }

            fs.unlink(oldDataRelativeUrl, (error) => {
                if (error) {
                    this.logger.error(`[FileService] Cannot delete file: ${fileUrl}`, error);
                    resolve(false);
                } else {
                    this.logger.log('info', `[FileService] File deleted: ${fileUrl}`);
                    resolve(true);
                }
            });
        });
    }
}
