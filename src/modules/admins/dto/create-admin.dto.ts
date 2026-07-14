import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { AdminRole } from '@prisma/client';

export class CreateAdminDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(72) // bcrypt truncates beyond 72 bytes
  password: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}
