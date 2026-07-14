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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_util_1 = require("../../common/utils/slugify.util");
let TagsService = class TagsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
    }
    async create(dto) {
        const slug = (0, slugify_util_1.slugify)(dto.name);
        const existing = await this.prisma.tag.findUnique({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException(`Tag "${dto.name}" already exists`);
        }
        return this.prisma.tag.create({ data: { name: dto.name, slug } });
    }
    async remove(id) {
        try {
            await this.prisma.tag.delete({ where: { id } });
        }
        catch {
            throw new common_1.NotFoundException(`Tag #${id} not found`);
        }
    }
    async resolveByNames(names) {
        const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
        const tags = [];
        for (const name of uniqueNames) {
            const slug = (0, slugify_util_1.slugify)(name);
            const tag = await this.prisma.tag.upsert({
                where: { slug },
                update: {},
                create: { name, slug },
            });
            tags.push(tag);
        }
        return tags;
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagsService);
//# sourceMappingURL=tags.service.js.map