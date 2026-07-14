import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { unlink } from 'fs/promises';
import { readFileSync } from 'fs';
import { imageSize } from 'image-size';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto, PaginatedResult } from '../../common/dto/pagination-query.dto';
import { Media } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(file: Express.Multer.File, uploadedBy: number): Promise<Media> {
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

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<Media>> {
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
        orderBy: { createdAt: (query.order ?? 'desc').toLowerCase() as 'asc' | 'desc' },
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

  async findOne(id: number): Promise<Media> {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media #${id} not found`);
    }
    return media;
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);

    // Delete DB row first — if disk cleanup fails we don't want an orphaned
    // reference; the file itself can be swept up later if needed.
    await this.prisma.media.delete({ where: { id } });

    try {
      await unlink(media.path);
    } catch {
      // File already missing from disk — not fatal, the DB record is gone either way.
    }
  }

  private tryGetImageDimensions(
    filePath: string,
  ): { width: number; height: number } | null {
    try {
      const buffer = readFileSync(filePath);
      const { width, height } = imageSize(buffer);
      if (!width || !height) return null;
      return { width, height };
    } catch {
      // Not an image (e.g. PDF resume) or unreadable — dimensions are optional.
      return null;
    }
  }
}
