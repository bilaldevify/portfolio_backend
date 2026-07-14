import { Body, Controller, Delete, Get, Ip, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  submit(@Body() dto: CreateContactMessageDto, @Ip() ip: string) {
    return this.contactService.create(dto, ip);
  }

  // Everything below is protected by the global JwtAuthGuard — admin only.
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/read')
  markRead(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.markRead(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.remove(id);
  }
}
