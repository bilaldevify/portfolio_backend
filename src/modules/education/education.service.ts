import { Injectable, NotFoundException } from '@nestjs/common';
import { Education } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Education[]> {
    return this.prisma.education.findMany({ orderBy: { orderIndex: 'asc' } });
  }

  async findOne(id: number): Promise<Education> {
    const education = await this.prisma.education.findUnique({ where: { id } });
    if (!education) throw new NotFoundException(`Education #${id} not found`);
    return education;
  }

  async create(dto: CreateEducationDto): Promise<Education> {
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

  async update(id: number, dto: UpdateEducationDto): Promise<Education> {
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

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.education.delete({ where: { id } });
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.education.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        }),
      ),
    );
  }
}
