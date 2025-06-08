import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException {
  constructor() {
    super('Senha incorreta, tente novamente.', HttpStatus.UNAUTHORIZED);
  }
}
