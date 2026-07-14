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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const blog_service_1 = require("./blog.service");
const create_blog_post_dto_1 = require("./dto/create-blog-post.dto");
const update_blog_post_dto_1 = require("./dto/update-blog-post.dto");
const query_blog_posts_dto_1 = require("./dto/query-blog-posts.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_admin_decorator_1 = require("../../common/decorators/current-admin.decorator");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    findAllPublic(query) {
        return this.blogService.findAllPublic(query);
    }
    findBySlug(slug) {
        return this.blogService.findBySlug(slug);
    }
    findAllForAdmin(query) {
        return this.blogService.findAllForAdmin(query);
    }
    findOne(id) {
        return this.blogService.findOne(id);
    }
    create(dto, admin) {
        return this.blogService.create(dto, admin.id);
    }
    update(id, dto) {
        return this.blogService.update(id, dto);
    }
    remove(id) {
        return this.blogService.remove(id);
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_blog_posts_dto_1.QueryBlogPostsDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findAllPublic", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_blog_posts_dto_1.QueryBlogPostsDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findAllForAdmin", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_admin_decorator_1.CurrentAdmin)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_post_dto_1.CreateBlogPostDto, Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_blog_post_dto_1.UpdateBlogPostDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "remove", null);
exports.BlogController = BlogController = __decorate([
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map