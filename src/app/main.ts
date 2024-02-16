import { NestFactory } from '@nestjs/core';
import { appConfig } from 'src/shared/config/app';
import { AllExceptionsFilter } from 'src/shared/domain/errors/AllException.filter';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';

async function bootstrap() {
  const app = await NestFactory.create(SharedModule);
  app.useGlobalFilters(new AllExceptionsFilter(new DiscordWebhookProvider()));
  await app.listen(appConfig.PORT);
}
bootstrap();
