import { Injectable, NotFoundException } from '@nestjs/common';
import { Experience } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';

@Injectable()
export class ExperiencesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Experience[]> {
    return this.prisma.experience.findMany({ orderBy: { orderIndex: 'asc' } });
  }

  async findOne(id: number): Promise<Experience> {
    const experience = await this.prisma.experience.findUnique({ where: { id } });
    if (!experience) throw new NotFoundException(`Experience #${id} not found`);
    return experience;
  }

  async create(dto: CreateExperienceDto): Promise<Experience> {
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

  async update(id: number, dto: UpdateExperienceDto): Promise<Experience> {
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

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.experience.delete({ where: { id } });
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.experience.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        }),
      ),
    );
  }
}
