"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const media_service_1 = require("./media.service");
const media_controller_1 = require("./media.controller");
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
]);
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    storage: (0, multer_1.diskStorage)({
                        destination: configService.get('upload.dir', { infer: true }),
                        filename: (_req, file, callback) => {
                            const uniqueName = `${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname)}`;
                            callback(null, uniqueName);
                        },
                    }),
                    limits: {
                        fileSize: configService.get('upload.maxFileSizeMb', { infer: true }) *
                            1024 *
                            1024,
                    },
                    fileFilter: (_req, file, callback) => {
                        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
                            callback(new common_1.BadRequestException(`Unsupported file type: ${file.mimetype}. Allowed: images (jpg, png, webp, gif, svg) and PDF.`), false);
                            return;
                        }
                        callback(null, true);
                    },
                }),
            }),
        ],
        controllers: [media_controller_1.MediaController],
        providers: [media_service_1.MediaService],
        exports: [media_service_1.MediaService],
    })
], MediaModule);
//# sourceMappingURL=media.module.js.map