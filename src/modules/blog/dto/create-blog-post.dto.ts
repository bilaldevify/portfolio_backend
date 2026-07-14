import { IsArray, IsIn, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  coverMediaId?: number;

  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';

  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
