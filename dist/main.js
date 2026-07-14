"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get((config_1.ConfigService));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.enableCors({
        origin: configService.get('frontendUrl', { infer: true }),
        credentials: true,
    });
    const port = configService.get('port', { infer: true });
    await app.listen(port);
    common_1.Logger.log(`🚀 API running on http://localhost:${port}/api`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map