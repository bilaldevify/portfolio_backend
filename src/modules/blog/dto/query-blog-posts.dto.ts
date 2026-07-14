import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryBlogPostsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  tag?: string;

  // Admin-only filter; the public endpoint always forces status=published.
  @IsOptional()
  @IsIn(['draft', 'published'])
  status?: 'draft' | 'published';
}
