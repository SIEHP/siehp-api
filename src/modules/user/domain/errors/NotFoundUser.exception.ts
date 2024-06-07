import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends HttpException {
  constructor() {
    super('Usuário não encontrado, contate o suporte.', HttpStatus.NOT_FOUND);
  }
}
