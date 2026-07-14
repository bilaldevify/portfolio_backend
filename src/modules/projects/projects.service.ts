import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TagsService } from '../tags/tags.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { PaginatedResult } from '../../common/dto/pagination-query.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { slugify } from '../../common/utils/slugify.util';

const PROJECT_INCLUDE = {
  thumbnail: true,
  images: { include: { media: true }, orderBy: { orderIndex: 'asc' as const } },
  tags: { include: { tag: true } },
};

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
  ) {}

  private async generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
    const base = slugify(title);
    let candidate = base;
    let suffix = 2;
    // Small tables, small N — a loop is simpler and clearer than a clever query.
    while (
      await this.prisma.project.findFirst({
        where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      })
    ) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }

  async findAllPublic(query: QueryProjectsDto): Promise<PaginatedResult<Project>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where = {
      deletedAt: null,
      status: 'published' as const,
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

  async findAllForAdmin(query: QueryProjectsDto): Promise<PaginatedResult<Project>> {
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

  async findOne(id: number): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: PROJECT_INCLUDE,
    });
    if (!project) throw new NotFoundException(`Project #${id} not found`);
    return project;
  }

  async findBySlug(slug: string): Promise<Project> {
    const project = await this.prisma.project.findFirst({
      where: { slug, deletedAt: null, status: 'published' },
      include: PROJECT_INCLUDE,
    });
    if (!project) throw new NotFoundException(`Project "${slug}" not found`);

    // Fire-and-forget view counter — not worth blocking the response on.
    this.prisma.project
      .update({ where: { id: project.id }, data: { views: { increment: 1 } } })
      .catch(() => undefined);

    return project;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
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

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
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

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.project.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        }),
      ),
    );
  }
}
