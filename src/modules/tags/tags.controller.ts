import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './tag.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public()
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  // Protected by the global JwtAuthGuard — admin only.
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}
