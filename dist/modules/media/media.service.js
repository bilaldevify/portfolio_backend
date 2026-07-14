"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const image_size_1 = require("image-size");
const prisma_service_1 = require("../../prisma/prisma.service");
let MediaService = class MediaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(file, uploadedBy) {
        const dimensions = this.tryGetImageDimensions(file.path);
        return this.prisma.media.create({
            data: {
                disk: 'local',
                path: file.path,
                url: `/uploads/${file.filename}`,
                originalName: file.originalname,
                mimeType: file.mimetype,
                sizeBytes: file.size,
                width: dimensions?.width ?? null,
                height: dimensions?.height ?? null,
                uploadedBy,
            },
        });
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = query.search
            ? {
                originalName: {
                    contains: query.search,
                },
            }
            : {};
        const [data, total] = await Promise.all([
            this.prisma.media.findMany({
                where,
                orderBy: { createdAt: (query.order ?? 'desc').toLowerCase() },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.media.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const media = await this.prisma.media.findUnique({ where: { id } });
        if (!media) {
            throw new common_1.NotFoundException(`Media #${id} not found`);
        }
        return media;
    }
    async remove(id) {
        const media = await this.findOne(id);
        await this.prisma.media.delete({ where: { id } });
        try {
            await (0, promises_1.unlink)(media.path);
        }
        catch {
        }
    }
    tryGetImageDimensions(filePath) {
        try {
            const buffer = (0, fs_1.readFileSync)(filePath);
            const { width, height } = (0, image_size_1.imageSize)(buffer);
            if (!width || !height)
                return null;
            return { width, height };
        }
        catch {
            return null;
        }
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map