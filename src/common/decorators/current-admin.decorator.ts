import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedAdmin } from '../../modules/auth/strategies/jwt.strategy';

/**
 * Usage: @CurrentAdmin() admin: AuthenticatedAdmin
 * Pulls the admin payload attached by JwtStrategy.validate() onto the request.
 */
export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
