import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryProjectsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  featured?: string;

  // Admin-only filter; the public endpoint always forces status=published.
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';
}
