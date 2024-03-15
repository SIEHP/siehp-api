import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { appConfig } from 'src/shared/config/app';
import { sharedSwaggerConfig } from 'src/shared/config/swagger';
import { AllExceptionsFilter } from 'src/shared/domain/errors/AllException.filter';
import { ZodValidationExceptionFilter } from 'src/shared/domain/errors/ZodValidationException.filter';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(SharedModule);
  app.useGlobalFilters(
    new AllExceptionsFilter(new DiscordWebhookProvider()),
    new ZodValidationExceptionFilter(),
  );

  patchNestJsSwagger();

  const sharedDocument = SwaggerModule.createDocument(app, sharedSwaggerConfig);
  SwaggerModule.setup('swagger', app, sharedDocument);

  await app.listen(appConfig.PORT);
}
bootstrap();
