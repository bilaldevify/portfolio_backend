import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { UpsertSettingKvDto } from './dto/upsert-setting-kv.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  // Everything below is protected by the global JwtAuthGuard — admin only.
  @Patch()
  update(@Body() dto: UpdateSiteSettingsDto) {
    return this.settingsService.updateSiteSettings(dto);
  }

  @Get('kv')
  getAllKv() {
    return this.settingsService.getAllKv();
  }

  @Put('kv')
  upsertKv(@Body() dto: UpsertSettingKvDto) {
    return this.settingsService.upsertKv(dto);
  }

  @Delete('kv/:key')
  deleteKv(@Param('key') key: string) {
    return this.settingsService.deleteKv(key);
  }
}
