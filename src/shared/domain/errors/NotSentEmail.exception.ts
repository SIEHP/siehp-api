import { HttpException, HttpStatus } from '@nestjs/common';

export class NotSentEmailException extends HttpException {
  constructor() {
    const errorMessage = 'Erro ao enviar email.\n Tente novamente mais tarde.';

    super(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
