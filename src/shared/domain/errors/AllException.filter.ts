import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerProvider } from 'src/shared/infra/providers/Logger.provider';
import { ZodError } from 'zod';

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

    let message =
      exception instanceof Error ? exception.message : 'Internal Server Error';
    
    // Adicionar informações detalhadas para erros de validação do Zod
    let details;
    
    if (exception instanceof ZodError) {
      details = exception.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      message = 'Erro de validação: dados inválidos ou faltando';
    }

    const responseJSON = {
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      details,
    };

    await this.loggerProvider.error(responseJSON);

    response.status(status).json(responseJSON);
  }
}
