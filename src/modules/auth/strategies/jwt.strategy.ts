import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../../config/configuration';
import { AdminRole } from '@prisma/client';

export interface JwtPayload {
  sub: number;
  email: string;
  role: AdminRole;
}

export interface AuthenticatedAdmin {
  id: number;
  email: string;
  role: AdminRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<AppConfig, true>) {
    const secret = configService.get('jwt.secret', { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // Runs after signature + expiry are verified by passport-jwt.
  validate(payload: JwtPayload): AuthenticatedAdmin {
    if (!payload?.sub || !payload?.email || !payload?.role) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
