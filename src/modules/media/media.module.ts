import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { AppConfig } from '../../config/configuration';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]);

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => ({
        storage: diskStorage({
          destination: configService.get('upload.dir', { infer: true }),
          filename: (_req, file, callback) => {
            const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
            callback(null, uniqueName);
          },
        }),
        limits: {
          fileSize:
            configService.get('upload.maxFileSizeMb', { infer: true }) *
            1024 *
            1024,
        },
        fileFilter: (_req, file, callback) => {
          if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            callback(
              new BadRequestException(
                `Unsupported file type: ${file.mimetype}. Allowed: images (jpg, png, webp, gif, svg) and PDF.`,
              ),
              false,
            );
            return;
          }
          callback(null, true);
        },
      }),
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
