import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { AuthenticatedAdmin } from './strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // Protected by the global JwtAuthGuard — lets the admin frontend verify
  // an existing token / fetch the current admin on page load.
  @Get('me')
  me(@CurrentAdmin() admin: AuthenticatedAdmin) {
    return admin;
  }
}
