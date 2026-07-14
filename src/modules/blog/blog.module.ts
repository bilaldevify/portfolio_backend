import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TagsModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
