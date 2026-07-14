import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @MaxLength(150)
  clientName: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  clientRole?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  clientCompany?: string;

  @IsOptional()
  @IsInt()
  avatarMediaId?: number;

  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
