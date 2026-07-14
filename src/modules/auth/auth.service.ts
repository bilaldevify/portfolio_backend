import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Admin } from '@prisma/client';
import { AdminsService } from '../admins/admins.service';

export interface LoginResult {
  accessToken: string;
  admin: {
    id: number;
    name: string;
    email: string;
    role: Admin['role'];
    avatar: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const admin = await this.adminsService.findByEmailWithPassword(email);

    // Same error for "not found" and "wrong password" — don't leak which one.
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.adminsService.recordLogin(admin.id);

    const accessToken = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      accessToken,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    };
  }
}
