import { NestFactory } from '@nestjs/core';
import { SharedModule } from 'src/shared/infra/modules/Shared.module';

async function bootstrap() {
  const app = await NestFactory.create(SharedModule);
  await app.listen(process.env.APP_PORT || 8080);
}
bootstrap();
