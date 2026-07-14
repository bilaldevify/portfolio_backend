import { Injectable, NotFoundException } from '@nestjs/common';
import { Testimonial } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: approved testimonials only, ordered for display. */
  findAllApproved(): Promise<Testimonial[]> {
    return this.prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { orderIndex: 'asc' },
    });
  }

  /** Admin: everything, including pending ones awaiting moderation. */
  findAllForAdmin(): Promise<Testimonial[]> {
    return this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number): Promise<Testimonial> {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) throw new NotFoundException(`Testimonial #${id} not found`);
    return testimonial;
  }

  create(dto: CreateTestimonialDto): Promise<Testimonial> {
    return this.prisma.testimonial.create({ data: dto });
  }

  async update(id: number, dto: UpdateTestimonialDto): Promise<Testimonial> {
    await this.findOne(id);
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  async approve(id: number): Promise<Testimonial> {
    await this.findOne(id);
    return this.prisma.testimonial.update({ where: { id }, data: { isApproved: true } });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.testimonial.delete({ where: { id } });
  }

  async reorder(dto: ReorderDto): Promise<void> {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.testimonial.update({
          where: { id: item.id },
          data: { orderIndex: item.orderIndex },
        }),
      ),
    );
  }
}
