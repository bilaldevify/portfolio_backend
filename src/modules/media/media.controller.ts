import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { AuthenticatedAdmin } from '../auth/strategies/jwt.strategy';

// Protected by the global JwtAuthGuard — any authenticated admin (editor or
// super_admin) can manage media, it's not restricted like /admins is.
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentAdmin() admin: AuthenticatedAdmin,
  ) {
    if (!file) {
      throw new BadRequestException('No file was uploaded');
    }
    return this.mediaService.create(file, admin.id);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.mediaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.mediaService.remove(id);
  }
}
