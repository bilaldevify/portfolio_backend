import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  // Public submissions land here unapproved — clients can submit their own
  // testimonial, but it won't show on the site until an admin approves it.
  @Public()
  @Post()
  submit(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create({ ...dto, isApproved: false });
  }

  @Public()
  @Get()
  findAllApproved() {
    return this.testimonialsService.findAllApproved();
  }

  // Everything below is protected by the global JwtAuthGuard — admin only.
  @Get('admin')
  findAllForAdmin() {
    return this.testimonialsService.findAllForAdmin();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialsService.findOne(id);
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.testimonialsService.reorder(dto);
  }

  @Patch(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialsService.approve(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialsService.remove(id);
  }
}
