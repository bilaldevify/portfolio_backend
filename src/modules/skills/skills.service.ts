import { Injectable, NotFoundException } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: visible skills only, ordered for display. */
  findAllVisible(): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /** Admin: every skill regardless of visibility. */
  findAllForAdmin(): Promise<Skill[]> {
    return this.prisma.skill.findMany({ orderBy: { orderIndex: 'asc' } });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException(`Skill #${id} not found`);
    return skill;
  }

  async create(dto: CreateSkillDto): Promise<Skill> {
    const maxOrder = await this.prisma.skill.aggregate({ _max: { orderIndex: true } });
    return this.prisma.skill.create({
      data: { ...dto, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 },
    });
  }

  async update(id: number, dto: UpdateSkillDto): Promise<Skill> {
    await this.findOne(id);
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.skill.delete({ where: { id } });
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.skill.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        }),
      ),
    );
  }
}
