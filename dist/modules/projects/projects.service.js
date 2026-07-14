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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tags_service_1 = require("../tags/tags.service");
const slugify_util_1 = require("../../common/utils/slugify.util");
const PROJECT_INCLUDE = {
    thumbnail: true,
    images: { include: { media: true }, orderBy: { orderIndex: 'asc' } },
    tags: { include: { tag: true } },
};
let ProjectsService = class ProjectsService {
    constructor(prisma, tagsService) {
        this.prisma = prisma;
        this.tagsService = tagsService;
    }
    async generateUniqueSlug(title, excludeId) {
        const base = (0, slugify_util_1.slugify)(title);
        let candidate = base;
        let suffix = 2;
        while (await this.prisma.project.findFirst({
            where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
        })) {
            candidate = `${base}-${suffix}`;
            suffix += 1;
        }
        return candidate;
    }
    async findAllPublic(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {
            deletedAt: null,
            status: 'published',
            ...(query.category ? { category: query.category } : {}),
            ...(query.featured === 'true' ? { isFeatured: true } : {}),
            ...(query.tag ? { tags: { some: { tag: { slug: query.tag } } } } : {}),
            ...(query.search
                ? { title: { contains: query.search } }
                : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                include: PROJECT_INCLUDE,
                orderBy: { orderIndex: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.project.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findAllForAdmin(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {
            deletedAt: null,
            ...(query.status ? { status: query.status } : {}),
            ...(query.category ? { category: query.category } : {}),
            ...(query.search ? { title: { contains: query.search } } : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                include: PROJECT_INCLUDE,
                orderBy: { orderIndex: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.project.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const project = await this.prisma.project.findFirst({
            where: { id, deletedAt: null },
            include: PROJECT_INCLUDE,
        });
        if (!project)
            throw new common_1.NotFoundException(`Project #${id} not found`);
        return project;
    }
    async findBySlug(slug) {
        const project = await this.prisma.project.findFirst({
            where: { slug, deletedAt: null, status: 'published' },
            include: PROJECT_INCLUDE,
        });
        if (!project)
            throw new common_1.NotFoundException(`Project "${slug}" not found`);
        this.prisma.project
            .update({ where: { id: project.id }, data: { views: { increment: 1 } } })
            .catch(() => undefined);
        return project;
    }
    async create(dto) {
        const { imageMediaIds, tags, ...rest } = dto;
        const slug = await this.generateUniqueSlug(dto.title);
        const maxOrder = await this.prisma.project.aggregate({ _max: { orderIndex: true } });
        const resolvedTags = tags?.length ? await this.tagsService.resolveByNames(tags) : [];
        const project = await this.prisma.project.create({
            data: {
                ...rest,
                slug,
                orderIndex: (maxOrder._max.orderIndex ?? -1) + 1,
                publishedAt: rest.status === 'published' ? new Date() : null,
                images: imageMediaIds?.length
                    ? { create: imageMediaIds.map((mediaId, i) => ({ mediaId, orderIndex: i })) }
                    : undefined,
                tags: resolvedTags.length
                    ? { create: resolvedTags.map((tag) => ({ tagId: tag.id })) }
                    : undefined,
            },
            include: PROJECT_INCLUDE,
        });
        return project;
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const { imageMediaIds, tags, ...rest } = dto;
        const slug = dto.title && dto.title !== existing.title
            ? await this.generateUniqueSlug(dto.title, id)
            : undefined;
        const resolvedTags = tags !== undefined ? await this.tagsService.resolveByNames(tags) : undefined;
        return this.prisma.$transaction(async (tx) => {
            if (imageMediaIds !== undefined) {
                await tx.projectImage.deleteMany({ where: { projectId: id } });
            }
            if (resolvedTags !== undefined) {
                await tx.projectTag.deleteMany({ where: { projectId: id } });
            }
            return tx.project.update({
                where: { id },
                data: {
                    ...rest,
                    ...(slug ? { slug } : {}),
                    ...(rest.status === 'published' && existing.status !== 'published'
                        ? { publishedAt: new Date() }
                        : {}),
                    images: imageMediaIds?.length
                        ? { create: imageMediaIds.map((mediaId, i) => ({ mediaId, orderIndex: i })) }
                        : undefined,
                    tags: resolvedTags?.length
                        ? { create: resolvedTags.map((tag) => ({ tagId: tag.id })) }
                        : undefined,
                },
                include: PROJECT_INCLUDE,
            });
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async reorder(dto) {
        await this.prisma.$transaction(dto.items.map((item) => this.prisma.project.update({
            where: { id: item.id },
            data: { orderIndex: item.orderIndex },
        })));
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tags_service_1.TagsService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map