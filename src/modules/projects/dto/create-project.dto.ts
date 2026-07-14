import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(180)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  thumbnailMediaId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';

  /** Gallery images, in display order. */
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  imageMediaIds?: number[];

  /** Tag names — resolved/created via TagsService. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
