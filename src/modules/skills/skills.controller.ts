import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Public()
  @Get()
  findAllVisible() {
    return this.skillsService.findAllVisible();
  }

  // Everything below is protected by the global JwtAuthGuard — admin only.
  @Get('admin')
  findAllForAdmin() {
    return this.skillsService.findAllForAdmin();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.skillsService.reorder(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSkillDto) {
    return this.skillsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.remove(id);
  }
}
