import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { appConfig } from 'src/shared/config/app';
import { sharedSwaggerConfig } from 'src/shared/config/swagger';
import { AllExceptionsFilter } from 'src/shared/infra/filters/AllException.filter';
import { ZodValidationExceptionFilter } from 'src/shared/infra/filters/ZodValidationException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';

async function bootstrap() {
  const logger = new LoggerProvider(new DiscordWebhookProvider());

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new ZodValidationExceptionFilter(logger),
  );

  patchNestJsSwagger();

  const sharedDocument = SwaggerModule.createDocument(app, sharedSwaggerConfig);

  app.use(
    '/docs',
    apiReference({
      theme: 'deepSpace',
      spec: {
        content: sharedDocument,
      },
      metaData: {
        title: 'SIEHP API Docs',
        description: 'API Documentation for SIEHP',
      },
    }),
  );

  await app.listen(appConfig.PORT);
}
bootstrap();
