import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { AllExceptionsFilter } from './AllException.filter';
import { ValidationException } from './Validation.exception';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerProvider: LoggerProvider) {}

  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const zodExeception = new ValidationException(exception.getZodError());

    new AllExceptionsFilter(this.loggerProvider).catch(zodExeception, host);
  }
}
