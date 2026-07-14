import { IsEmail, IsInt, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  siteTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  tagline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  heroTitle?: string;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  aboutText?: string;

  @IsOptional()
  @IsInt()
  resumeMediaId?: number;

  @IsOptional()
  @IsInt()
  avatarMediaId?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  seoDescription?: string;
}
