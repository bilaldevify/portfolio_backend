import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { PrismaModule } from './prisma/prisma.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';
import { MediaModule } from './modules/media/media.module';
import { TagsModule } from './modules/tags/tags.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ExperiencesModule } from './modules/experiences/experiences.module';
import { EducationModule } from './modules/education/education.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { abortEarly: false },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    AdminsModule,
    MediaModule,
    TagsModule,
    SettingsModule,
    SkillsModule,
    ExperiencesModule,
    EducationModule,
    TestimonialsModule,
    ProjectsModule,
    BlogModule,
    ContactModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
