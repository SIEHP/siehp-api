import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { AllExceptionsFilter } from './AllException.filter';
import { DiscordWebhookProvider } from 'src/shared/infra/providers/DiscordWebhook.provider';
import { ValidationException } from './Validation.exception';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const zodExeception = new ValidationException(exception.getZodError());

    new AllExceptionsFilter(new DiscordWebhookProvider()).catch(
      zodExeception,
      host,
    );
  }
}
