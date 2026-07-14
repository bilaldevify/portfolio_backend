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
exports.EducationController = void 0;
const common_1 = require("@nestjs/common");
const education_service_1 = require("./education.service");
const create_education_dto_1 = require("./dto/create-education.dto");
const update_education_dto_1 = require("./dto/update-education.dto");
const reorder_dto_1 = require("../../common/dto/reorder.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let EducationController = class EducationController {
    constructor(educationService) {
        this.educationService = educationService;
    }
    findAll() {
        return this.educationService.findAll();
    }
    create(dto) {
        return this.educationService.create(dto);
    }
    reorder(dto) {
        return this.educationService.reorder(dto);
    }
    update(id, dto) {
        return this.educationService.update(id, dto);
    }
    remove(id) {
        return this.educationService.remove(id);
    }
};
exports.EducationController = EducationController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_education_dto_1.CreateEducationDto]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reorder_dto_1.ReorderDto]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_education_dto_1.UpdateEducationDto]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "remove", null);
exports.EducationController = EducationController = __decorate([
    (0, common_1.Controller)('education'),
    __metadata("design:paramtypes", [education_service_1.EducationService])
], EducationController);
//# sourceMappingURL=education.controller.js.map