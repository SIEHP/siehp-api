import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { AllExceptionsFilter } from './AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const errorMessage = exception
      .getZodError()
      .errors.map((error) => `${error.path} ${error.message}`)
      .join('\n');
    const zodExeception = new HttpException(errorMessage, 422);

    new AllExceptionsFilter(new DiscordWebhookProvider()).catch(
      zodExeception,
      host,
    );
  }
}
