import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './tag.dto';
import { slugify } from '../../common/utils/slugify.util';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const slug = slugify(dto.name);
    const existing = await this.prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Tag "${dto.name}" already exists`);
    }
    return this.prisma.tag.create({ data: { name: dto.name, slug } });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.tag.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Tag #${id} not found`);
    }
  }

  /**
   * Used internally by projects/blog when saving tag associations from a
   * list of tag names — creates any that don't exist yet, reuses the rest.
   */
  async resolveByNames(names: string[]): Promise<Tag[]> {
    const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
    const tags: Tag[] = [];
    for (const name of uniqueNames) {
      const slug = slugify(name);
      const tag = await this.prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
      tags.push(tag);
    }
    return tags;
  }
}
