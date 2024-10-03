import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggerProvider: LoggerProvider) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Internal Server Error';

    const responseJSON = {
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    await this.loggerProvider.error(responseJSON);

    response.status(status).json(responseJSON);
  }
}
