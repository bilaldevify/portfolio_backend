import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @MaxLength(180)
  institution: string;

  @IsString()
  @MaxLength(150)
  degree: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  field?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
