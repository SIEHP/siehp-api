import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { appConfig } from 'src/shared/config/app';
import { AllExceptionsFilter } from 'src/shared/domain/errors/AllException.filter';
import { ZodValidationExceptionFilter } from 'src/shared/domain/errors/ZodValidationException.filter';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';

async function bootstrap() {
  const app = await NestFactory.create(SharedModule);
  app.useGlobalFilters(
    new AllExceptionsFilter(new DiscordWebhookProvider()),
    new ZodValidationExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('SIEHP')
    .setDescription(
      'Documentação de roteamento para a interface de programação da aplicação SIEHP.',
    )
    .setVersion('0.0.1')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setExternalDoc('REPO', 'https://github.com/SIEHP/siehp-api')
    .build();

  patchNestJsSwagger();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(appConfig.PORT);
}
bootstrap();
