"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const configuration_1 = require("./config/configuration");
const validation_1 = require("./config/validation");
const prisma_module_1 = require("./prisma/prisma.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const admins_module_1 = require("./modules/admins/admins.module");
const media_module_1 = require("./modules/media/media.module");
const tags_module_1 = require("./modules/tags/tags.module");
const settings_module_1 = require("./modules/settings/settings.module");
const skills_module_1 = require("./modules/skills/skills.module");
const experiences_module_1 = require("./modules/experiences/experiences.module");
const education_module_1 = require("./modules/education/education.module");
const testimonials_module_1 = require("./modules/testimonials/testimonials.module");
const projects_module_1 = require("./modules/projects/projects.module");
const blog_module_1 = require("./modules/blog/blog.module");
const contact_module_1 = require("./modules/contact/contact.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                validationSchema: validation_1.validationSchema,
                validationOptions: { abortEarly: false },
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            admins_module_1.AdminsModule,
            media_module_1.MediaModule,
            tags_module_1.TagsModule,
            settings_module_1.SettingsModule,
            skills_module_1.SkillsModule,
            experiences_module_1.ExperiencesModule,
            education_module_1.EducationModule,
            testimonials_module_1.TestimonialsModule,
            projects_module_1.ProjectsModule,
            blog_module_1.BlogModule,
            contact_module_1.ContactModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map