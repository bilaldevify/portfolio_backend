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
exports.EducationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let EducationService = class EducationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.education.findMany({ orderBy: { orderIndex: 'asc' } });
    }
    async findOne(id) {
        const education = await this.prisma.education.findUnique({ where: { id } });
        if (!education)
            throw new common_1.NotFoundException(`Education #${id} not found`);
        return education;
    }
    async create(dto) {
        const maxOrder = await this.prisma.education.aggregate({ _max: { orderIndex: true } });
        return this.prisma.education.create({
            data: {
                ...dto,
                startDate: new Date(dto.startDate),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                orderIndex: (maxOrder._max.orderIndex ?? -1) + 1,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.education.update({
            where: { id },
            data: {
                ...dto,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.education.delete({ where: { id } });
    }
    async reorder(dto) {
        await this.prisma.$transaction(dto.items.map((item) => this.prisma.education.update({
            where: { id: item.id },
            data: { orderIndex: item.orderIndex },
        })));
    }
};
exports.EducationService = EducationService;
exports.EducationService = EducationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EducationService);
//# sourceMappingURL=education.service.js.map