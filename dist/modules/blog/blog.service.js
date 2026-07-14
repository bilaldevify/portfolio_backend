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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const tags_service_1 = require("../tags/tags.service");
const slugify_util_1 = require("../../common/utils/slugify.util");
const BLOG_INCLUDE = {
    cover: true,
    author: { select: { id: true, name: true, avatar: true } },
    tags: { include: { tag: true } },
};
let BlogService = class BlogService {
    constructor(prisma, tagsService) {
        this.prisma = prisma;
        this.tagsService = tagsService;
    }
    async generateUniqueSlug(title, excludeId) {
        const base = (0, slugify_util_1.slugify)(title);
        let candidate = base;
        let suffix = 2;
        while (await this.prisma.blogPost.findFirst({
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
            ...(query.tag ? { tags: { some: { tag: { slug: query.tag } } } } : {}),
            ...(query.search ? { title: { contains: query.search } } : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                include: BLOG_INCLUDE,
                orderBy: { publishedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.blogPost.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findAllForAdmin(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const where = {
            deletedAt: null,
            ...(query.status ? { status: query.status } : {}),
            ...(query.search ? { title: { contains: query.search } } : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                include: BLOG_INCLUDE,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.blogPost.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(id) {
        const post = await this.prisma.blogPost.findFirst({
            where: { id, deletedAt: null },
            include: BLOG_INCLUDE,
        });
        if (!post)
            throw new common_1.NotFoundException(`Blog post #${id} not found`);
        return post;
    }
    async findBySlug(slug) {
        const post = await this.prisma.blogPost.findFirst({
            where: { slug, deletedAt: null, status: 'published' },
            include: BLOG_INCLUDE,
        });
        if (!post)
            throw new common_1.NotFoundException(`Blog post "${slug}" not found`);
        this.prisma.blogPost
            .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
            .catch(() => undefined);
        return post;
    }
    async create(dto, authorId) {
        const { tags, ...rest } = dto;
        const slug = await this.generateUniqueSlug(dto.title);
        const resolvedTags = tags?.length ? await this.tagsService.resolveByNames(tags) : [];
        return this.prisma.blogPost.create({
            data: {
                ...rest,
                slug,
                authorId,
                publishedAt: rest.status === 'published' ? new Date() : null,
                tags: resolvedTags.length
                    ? { create: resolvedTags.map((tag) => ({ tagId: tag.id })) }
                    : undefined,
            },
            include: BLOG_INCLUDE,
        });
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const { tags, ...rest } = dto;
        const slug = dto.title && dto.title !== existing.title
            ? await this.generateUniqueSlug(dto.title, id)
            : undefined;
        const resolvedTags = tags !== undefined ? await this.tagsService.resolveByNames(tags) : undefined;
        return this.prisma.$transaction(async (tx) => {
            if (resolvedTags !== undefined) {
                await tx.blogPostTag.deleteMany({ where: { blogPostId: id } });
            }
            return tx.blogPost.update({
                where: { id },
                data: {
                    ...rest,
                    ...(slug ? { slug } : {}),
                    ...(rest.status === 'published' && existing.status !== 'published'
                        ? { publishedAt: new Date() }
                        : {}),
                    tags: resolvedTags?.length
                        ? { create: resolvedTags.map((tag) => ({ tagId: tag.id })) }
                        : undefined,
                },
                include: BLOG_INCLUDE,
            });
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tags_service_1.TagsService])
], BlogService);
//# sourceMappingURL=blog.service.js.map