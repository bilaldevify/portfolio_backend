import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Admin, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

const SALT_ROUNDS = 12;

/** Admin as safe to return to clients - password hash stripped. */
export type SafeAdmin = Omit<Admin, 'password'>;

function toSafeAdmin(admin: Admin): SafeAdmin {
  const { password, ...safe } = admin;
  return safe;
}

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdminDto): Promise<SafeAdmin> {
    const existing = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('An admin with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const admin = await this.prisma.admin.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: passwordHash,
        role: dto.role,
      },
    });
    return toSafeAdmin(admin);
  }

  async findAll(): Promise<SafeAdmin[]> {
    const admins = await this.prisma.admin.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return admins.map(toSafeAdmin);
  }

  async findOne(id: number): Promise<SafeAdmin> {
    const admin = await this.prisma.admin.findFirst({
      where: { id, deletedAt: null },
    });
    if (!admin) {
      throw new NotFoundException(`Admin #${id} not found`);
    }
    return toSafeAdmin(admin);
  }

  /**
   * Includes the password hash — used only internally by AuthService
   * for credential verification. Never expose this outside auth flows.
   */
  findByEmailWithPassword(email: string): Promise<Admin | null> {
    return this.prisma.admin.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async update(id: number, dto: UpdateAdminDto): Promise<SafeAdmin> {
    await this.findOne(id); // 404s if missing/soft-deleted
    const admin = await this.prisma.admin.update({
      where: { id },
      data: dto,
    });
    return toSafeAdmin(admin);
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    try {
      await this.prisma.admin.update({
        where: { id },
        data: { password: passwordHash },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new NotFoundException(`Admin #${id} not found`);
      }
      throw err;
    }
  }

  async recordLogin(id: number): Promise<void> {
    await this.prisma.admin.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // 404s if missing/already soft-deleted
    await this.prisma.admin.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
