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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const SALT_ROUNDS = 12;
function toSafeAdmin(admin) {
    const { password, ...safe } = admin;
    return safe;
}
let AdminsService = class AdminsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.admin.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('An admin with this email already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const admin = await this.prisma.admin.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: passwordHash,
                role: dto.role,
            },
        });
        return toSafeAdmin(admin);
    }
    async findAll() {
        const admins = await this.prisma.admin.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
        return admins.map(toSafeAdmin);
    }
    async findOne(id) {
        const admin = await this.prisma.admin.findFirst({
            where: { id, deletedAt: null },
        });
        if (!admin) {
            throw new common_1.NotFoundException(`Admin #${id} not found`);
        }
        return toSafeAdmin(admin);
    }
    findByEmailWithPassword(email) {
        return this.prisma.admin.findFirst({
            where: { email, deletedAt: null },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        const admin = await this.prisma.admin.update({
            where: { id },
            data: dto,
        });
        return toSafeAdmin(admin);
    }
    async updatePassword(id, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        try {
            await this.prisma.admin.update({
                where: { id },
                data: { password: passwordHash },
            });
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
                throw new common_1.NotFoundException(`Admin #${id} not found`);
            }
            throw err;
        }
    }
    async recordLogin(id) {
        await this.prisma.admin.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.admin.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminsService);
//# sourceMappingURL=admins.service.js.map