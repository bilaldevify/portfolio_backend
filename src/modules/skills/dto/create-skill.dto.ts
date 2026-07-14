import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  proficiency?: number;

  @IsOptional()
  @IsInt()
  iconMediaId?: number;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
