import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { QueryBlogPostsDto } from './dto/query-blog-posts.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { AuthenticatedAdmin } from '../auth/strategies/jwt.strategy';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  findAllPublic(@Query() query: QueryBlogPostsDto) {
    return this.blogService.findAllPublic(query);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  // Everything below is protected by the global JwtAuthGuard — admin only.
  @Get('admin')
  findAllForAdmin(@Query() query: QueryBlogPostsDto) {
    return this.blogService.findAllForAdmin(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBlogPostDto, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.blogService.create(dto, admin.id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
