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
exports.ExperiencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ExperiencesService = class ExperiencesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.experience.findMany({ orderBy: { orderIndex: 'asc' } });
    }
    async findOne(id) {
        const experience = await this.prisma.experience.findUnique({ where: { id } });
        if (!experience)
            throw new common_1.NotFoundException(`Experience #${id} not found`);
        return experience;
    }
    async create(dto) {
        const maxOrder = await this.prisma.experience.aggregate({ _max: { orderIndex: true } });
        return this.prisma.experience.create({
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
        return this.prisma.experience.update({
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
        await this.prisma.experience.delete({ where: { id } });
    }
    async reorder(dto) {
        await this.prisma.$transaction(dto.items.map((item) => this.prisma.experience.update({
            where: { id: item.id },
            data: { orderIndex: item.orderIndex },
        })));
    }
};
exports.ExperiencesService = ExperiencesService;
exports.ExperiencesService = ExperiencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExperiencesService);
//# sourceMappingURL=experiences.service.js.map