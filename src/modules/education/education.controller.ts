import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Public()
  @Get()
  findAll() {
    return this.educationService.findAll();
  }

  // Everything below is protected by the global JwtAuthGuard — admin only.
  @Post()
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(dto);
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.educationService.reorder(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEducationDto) {
    return this.educationService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.educationService.remove(id);
  }
}
