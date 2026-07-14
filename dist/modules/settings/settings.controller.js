"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const update_site_settings_dto_1 = require("./dto/update-site-settings.dto");
const upsert_setting_kv_dto_1 = require("./dto/upsert-setting-kv.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getPublicSettings() {
        return this.settingsService.getPublicSettings();
    }
    update(dto) {
        return this.settingsService.updateSiteSettings(dto);
    }
    getAllKv() {
        return this.settingsService.getAllKv();
    }
    upsertKv(dto) {
        return this.settingsService.upsertKv(dto);
    }
    deleteKv(key) {
        return this.settingsService.deleteKv(key);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getPublicSettings", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_site_settings_dto_1.UpdateSiteSettingsDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('kv'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAllKv", null);
__decorate([
    (0, common_1.Put)('kv'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_setting_kv_dto_1.UpsertSettingKvDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "upsertKv", null);
__decorate([
    (0, common_1.Delete)('kv/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "deleteKv", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map