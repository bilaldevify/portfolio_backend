import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @MaxLength(150)
  company: string;

  @IsString()
  @MaxLength(150)
  role: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string; // omit/null = current position
}
