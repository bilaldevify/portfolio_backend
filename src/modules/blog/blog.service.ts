import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPost } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TagsService } from '../tags/tags.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { QueryBlogPostsDto } from './dto/query-blog-posts.dto';
import { PaginatedResult } from '../../common/dto/pagination-query.dto';
import { slugify } from '../../common/utils/slugify.util';

const BLOG_INCLUDE = {
  cover: true,
  author: { select: { id: true, name: true, avatar: true } },
  tags: { include: { tag: true } },
};

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
  ) {}

  private async generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
    const base = slugify(title);
    let candidate = base;
    let suffix = 2;
    while (
      await this.prisma.blogPost.findFirst({
        where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      })
    ) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }

  async findAllPublic(query: QueryBlogPostsDto): Promise<PaginatedResult<BlogPost>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const where = {
      deletedAt: null,
      status: 'published' as const,
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

  async findAllForAdmin(query: QueryBlogPostsDto): Promise<PaginatedResult<BlogPost>> {
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

  async findOne(id: number): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      include: BLOG_INCLUDE,
    });
    if (!post) throw new NotFoundException(`Blog post #${id} not found`);
    return post;
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, deletedAt: null, status: 'published' },
      include: BLOG_INCLUDE,
    });
    if (!post) throw new NotFoundException(`Blog post "${slug}" not found`);

    this.prisma.blogPost
      .update({ where: { id: post.id }, data: { views: { increment: 1 } } })
      .catch(() => undefined);

    return post;
  }

  async create(dto: CreateBlogPostDto, authorId: number): Promise<BlogPost> {
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

  async update(id: number, dto: UpdateBlogPostDto): Promise<BlogPost> {
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

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
