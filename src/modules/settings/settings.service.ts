import { Injectable } from '@nestjs/common';
import { SettingKv, SiteSetting } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { UpsertSettingKvDto } from './dto/upsert-setting-kv.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Site settings is a singleton row. Creates a default row on first access
   * so the app never has to special-case "no settings yet".
   */
  async getSiteSettings(): Promise<SiteSetting> {
    const existing = await this.prisma.siteSetting.findFirst();
    if (existing) return existing;
    return this.prisma.siteSetting.create({ data: {} });
  }

  async updateSiteSettings(dto: UpdateSiteSettingsDto): Promise<SiteSetting> {
    const current = await this.getSiteSettings();
    return this.prisma.siteSetting.update({
      where: { id: current.id },
      data: dto,
    });
  }

  getAllKv(): Promise<SettingKv[]> {
    return this.prisma.settingKv.findMany({ orderBy: { key: 'asc' } });
  }

  upsertKv(dto: UpsertSettingKvDto): Promise<SettingKv> {
    return this.prisma.settingKv.upsert({
      where: { key: dto.key },
      update: { value: dto.value },
      create: { key: dto.key, value: dto.value },
    });
  }

  async deleteKv(key: string): Promise<void> {
    await this.prisma.settingKv.deleteMany({ where: { key } });
  }

  /** Public-facing shape: site settings + kv pairs flattened into one object. */
  async getPublicSettings() {
    const [siteSettings, kvPairs] = await Promise.all([
      this.getSiteSettings(),
      this.getAllKv(),
    ]);
    const kv = Object.fromEntries(kvPairs.map((p) => [p.key, p.value]));
    return { ...siteSettings, extra: kv };
  }
}
