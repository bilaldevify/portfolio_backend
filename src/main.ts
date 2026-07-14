import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfig, true>);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not defined in the DTO
      forbidNonWhitelisted: true, // reject requests with unknown properties
      transform: true, // auto-transform payloads to DTO instances/types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: configService.get('frontendUrl', { infer: true }),
    credentials: true,
  });

  const port = configService.get('port', { infer: true });
  await app.listen(port);
  Logger.log(`🚀 API running on http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
