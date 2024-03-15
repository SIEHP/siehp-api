import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor() {
    super('Erro de valição', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
