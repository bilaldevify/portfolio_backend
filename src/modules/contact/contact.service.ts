import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactMessage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { PaginatedResult, PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContactMessageDto, ipAddress?: string): Promise<ContactMessage> {
    return this.prisma.contactMessage.create({ data: { ...dto, ipAddress } });
  }

  async findAll(query: PaginationQueryDto): Promise<PaginatedResult<ContactMessage>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contactMessage.count(),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number): Promise<ContactMessage> {
    const message = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!message) throw new NotFoundException(`Message #${id} not found`);
    return message;
  }

  async markRead(id: number): Promise<ContactMessage> {
    await this.findOne(id);
    return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.contactMessage.delete({ where: { id } });
  }
}
