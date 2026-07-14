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
exports.ExperiencesController = void 0;
const common_1 = require("@nestjs/common");
const experiences_service_1 = require("./experiences.service");
const create_experience_dto_1 = require("./dto/create-experience.dto");
const update_experience_dto_1 = require("./dto/update-experience.dto");
const reorder_dto_1 = require("../../common/dto/reorder.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let ExperiencesController = class ExperiencesController {
    constructor(experiencesService) {
        this.experiencesService = experiencesService;
    }
    findAll() {
        return this.experiencesService.findAll();
    }
    create(dto) {
        return this.experiencesService.create(dto);
    }
    reorder(dto) {
        return this.experiencesService.reorder(dto);
    }
    update(id, dto) {
        return this.experiencesService.update(id, dto);
    }
    remove(id) {
        return this.experiencesService.remove(id);
    }
};
exports.ExperiencesController = ExperiencesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_experience_dto_1.CreateExperienceDto]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reorder_dto_1.ReorderDto]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_experience_dto_1.UpdateExperienceDto]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "remove", null);
exports.ExperiencesController = ExperiencesController = __decorate([
    (0, common_1.Controller)('experiences'),
    __metadata("design:paramtypes", [experiences_service_1.ExperiencesService])
], ExperiencesController);
//# sourceMappingURL=experiences.controller.js.map