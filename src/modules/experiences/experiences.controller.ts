import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Public()
  @Get()
  findAll() {
    return this.experiencesService.findAll();
  }

  // Everything below is protected by the global JwtAuthGuard — admin only.
  @Post()
  create(@Body() dto: CreateExperienceDto) {
    return this.experiencesService.create(dto);
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.experiencesService.reorder(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExperienceDto) {
    return this.experiencesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.experiencesService.remove(id);
  }
}
